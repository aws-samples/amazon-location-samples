// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useRef, useEffect, useCallback } from "react";
import Map from "react-map-gl";
import maplibregl from "maplibre-gl";
import { Flex, Text } from "@aws-amplify/ui-react";
import Controls from "./components/overlays/Controls";
import { Hub } from "@aws-amplify/core";
import useAmazonLocationService from "./hooks/useAmazonLocationService";
import useDebounce from "./hooks/useDebounce";
import {
  AppContext,
  defaultState,
  RoutingModesEnum,
  UnitsEnum,
} from "./AppContext";
import useWindowSize from "./hooks/useWindowSize";
import { Header } from "./components/Header";
import Features from "./components/overlays/Features";
import MarkerControl from "./components/overlays/MarkerToast";
import RoutingControl from "./components/overlays/RoutingMenu";
import { Geo } from "@aws-amplify/geo";

function App() {
  // Setting state variables
  const [viewState, setViewState] = useState({
    latitude: 36.12185075270952,
    longitude: -115.17130273723231,
    zoom: 13,
  });
  const [markers, setMarkers] = useState(defaultState.markers);
  const [isRouting, setRouting] = useState(defaultState.isRouting);
  const [route, setRoute] = useState(defaultState.route);
  const [routingMode, setRoutingMode] = useState(defaultState.routingMode);
  const [truckOptions, setTruckOptions] = useState(defaultState.truckOptions);
  const [carOptions, setCarOptions] = useState(defaultState.carOptions);
  const [departureTime, setDepartureTime] = useState(
    defaultState.departureTime
  );
  const [distanceUnit, setDistanceUnit] = useState(defaultState.distanceUnit);
  const [units, setUnits] = useState(defaultState.units);
  // Setting refs
  const mapRef = useRef();
  const isRouteZoomedRef = useRef(false);
  const isPointZoomed = useRef(false);
  // Setting hooks
  const windowSize = useWindowSize();
  const debouncedViewState = useDebounce(viewState, 500);
  const [transformRequest, mapName, calculateRoute] =
    useAmazonLocationService();

  // Functions that moves the viewport so that it fits a route once it is calculated
  const zoomToRoute = useCallback((routeBBox, windowSize) => {
    console.debug("Fitting route bbox to viewport", routeBBox);
    mapRef.current.fitBounds(
      [
        [routeBBox[0], routeBBox[1]],
        [routeBBox[2], routeBBox[3]],
      ],
      {
        padding: {
          top: 50,
          bottom: 50,
          left: 50,
          right: windowSize.width > 768 ? 450 : 50, // TODO: see if we can get rid of this
        },
        speed: 0.8,
        linear: false
      }
    );
  }, []);

  const zoomToPoint = useCallback((lngLat) => {
    console.debug("Fitting point to viewport", lngLat);
    mapRef.current.flyTo({
      center: lngLat,
      zoom: 15,
      speed: 0.8,
    });
  }, []);

  // Reset the view to default values
  const resetView = () => {
    setRouting(defaultState.isRouting);
    setMarkers(defaultState.markers);
    setRoute(defaultState.route);
    setRoutingMode(defaultState.routingMode);
    setTruckOptions(defaultState.truckOptions);
    setCarOptions(defaultState.carOptions);
    setDepartureTime(defaultState.departureTime);
    isRouteZoomedRef.current = false;
    isPointZoomed.current = false;
  };

  // Side effect that runs every time there is a new route and it hasn't yet been zoomed to
  useEffect(() => {
    if (route !== defaultState.route && !isRouteZoomedRef.current) {
      isRouteZoomedRef.current = true;
      zoomToRoute(route.Summary.RouteBBox, windowSize);
    }
  }, [route, windowSize, zoomToRoute]);

  useEffect(() => {
    if (markers.length === 1 && !isPointZoomed.current) {
      isPointZoomed.current = true;
      zoomToPoint(markers[0].geometry.point);
    }
  }, [markers, zoomToPoint]);

  // Side effect that calculates a new route every time one of the options changes
  useEffect(() => {
    const route = async () => {
      try {
        // Calculate the route using the function from the useAmazonLocationService hook
        const res = await calculateRoute(
          routingMode,
          markers.map((marker) => marker.geometry.point),
          carOptions,
          truckOptions,
          departureTime,
          distanceUnit
        );
        console.debug("Route retrieved", res);
        // Reset the zoom ref to false so the route can be zoomed to
        isRouteZoomedRef.current = false;
        // Remove metadata from response to avoid polluting state
        delete res.$metadata;
        setRoute(res);
      } catch (error) {
        console.log(error);
      }
    };

    // Run the route function only when there are at least two valid markers
    if (
      markers.length >= 2 &&
      markers.every(
        (marker) =>
          marker !== undefined &&
          typeof marker === "object" &&
          Object.keys(marker).length > 0
      )
    ) {
      console.debug("Calculating route with markers", markers);
      route();
    }
  }, [
    markers,
    routingMode,
    carOptions,
    truckOptions,
    departureTime,
    calculateRoute,
    distanceUnit,
  ]);

  // Action router that handles Routing events from the Hub
  const handleRouting = async (message) => {
    if (!message) {
      return;
    }
    const { event, data } = message.payload;
    // Enter routing mode
    if (event === "startRouting") {
      setRouting(true);
      // Exit routing mode
    } else if (event === "endRouting") {
      resetView();
      // Change routing mode (Car, Truck, Walking) and set options
    } else if (event === "changeRoutingMode") {
      if (data !== routingMode) {
        console.debug("Changing routing mode to", data);
        setRoutingMode(data);
        setTruckOptions(defaultState.truckOptions);
        setCarOptions(defaultState.carOptions);
      }
      // Change avoidances and persist them in respective options based on routing mode
    } else if (event === "changeAvoidances") {
      const { key, value } = data;
      if (message.source === RoutingModesEnum.CAR) {
        const newState = { ...carOptions };
        newState[key] = value;
        setCarOptions(newState);
      } else if (message.source === RoutingModesEnum.TRUCK) {
        const newState = { ...truckOptions };
        newState[key] = value;
        setTruckOptions(newState);
      }
      // Change truck routing mode options
    } else if (event === "changeTruckOptions") {
      const newState = { ...truckOptions };
      newState[message.source] = data;
      setTruckOptions(newState);
      // Change departure time
    } else if (event === "changeDepartureTime") {
      if (data !== departureTime) {
        console.debug("Setting departure time to", data.toISOString());
        setDepartureTime(data);
      }
      // Change distance unit of measurement between imperial and metric
    } else if (event === "changeDistanceUnit") {
      setDistanceUnit(data);
      // Change general units of measurement between imperial and metric
    } else if (event === "changeUnits") {
      if (data !== units) {
        console.debug(
          "Setting DistanceUnit to",
          UnitsEnum[data.toUpperCase()].distance
        );
        setDistanceUnit(UnitsEnum[data.toUpperCase()].distance);
        const newState = { ...truckOptions };
        newState.Weight.Unit = UnitsEnum[data.toUpperCase()].weight;
        newState.Dimensions.Unit = UnitsEnum[data.toUpperCase()].dimensions;
        console.debug(
          "Setting TruckOptions.Weight.Unit to",
          UnitsEnum[data.toUpperCase()].weight
        );
        console.debug(
          "Setting TruckOptions.Dimensions.Unit to",
          UnitsEnum[data.toUpperCase()].dimensions
        );
        setTruckOptions(newState);
        setUnits(data);
      }
    }
  };

  // Action router that handles Marker events from the Hub
  const handleMarkers = async (data) => {
    const { payload } = data;
    // Reset the markers, and so also the view
    if (payload.event === "closeToast" || payload.event === "cleanUp") {
      resetView();
      // Swaps the position of the markers
    } else if (payload.event === "swapMarkers") {
      console.debug("Swapping markers", payload.data);
      const newMarkers = [];
      // If there's only one marker, we know it was a destination, so we put it in first place
      if (markers.length === 1) {
        newMarkers[0] = markers[0];
        newMarkers[1] = {};
        // If there are two markers we just swap them
      } else if (markers.length === 2) {
        newMarkers[0] = markers[1];
        newMarkers[1] = markers[0];
      }
      setMarkers(newMarkers);
    } else if (payload.event === "setMarker") {
      const { force, geocode } = payload.data;
      console.debug("Set marker %s", geocode ? "with geocode" : "");
      let marker;
      if (geocode) {
        try {
          marker = await Geo.searchByCoordinates(payload.data.lngLat);
        } catch (error) {
          console.log(error);
        }
      } else {
        marker = payload.data.marker;
      }
      let newMarkers = [...markers];
      if (newMarkers[payload.data.idx] !== undefined && !force) {
        newMarkers = [...newMarkers].slice();
        newMarkers.unshift({
          ...marker,
          source: data.source,
        });
      } else {
        newMarkers[payload.data.idx] = {
          ...marker,
          source: data.source,
        };
        if (payload.data.idx === 0) isPointZoomed.current = false;
      }
      setMarkers(newMarkers);
    }
  };

  // Side effects that runs when the component mounts and subscribes to the Hub
  useEffect(() => {
    Hub.listen("Markers", handleMarkers);
    Hub.listen("Routing", handleRouting);

    // Clean up subscriptions when the component unmounts
    return () => {
      Hub.remove("Markers", handleMarkers);
      Hub.remove("Routing", handleRouting);
    };
  });

  // Handler for the map click event
  const handleMapClick = async (e) => {
    // When there's already a marker and we are not in routing mode we just remove the existing marker
    if (markers.length > 0 && !isRouting) {
      Hub.dispatch("Markers", { event: "cleanUp" });
      console.debug("Cleaning up marker");
      return;
    }
    console.debug("Retrieving new marker");
    const { lngLat } = e;

    let data;
    if (markers.length === 0 || markers.length === 2) {
      // If there are no markers or there are already two (one might be a placeholder) then we set it as first marker (origin)
      data = { idx: 0, lngLat: lngLat.toArray(), geocode: true, force: true };
    } else if (markers.length === 1) {
      // Else if there is one marker we set the new one as first but shift the second to destination
      data = { idx: 0, lngLat: lngLat.toArray(), geocode: true, force: false };
    }

    // Dispatch event with constructed payload
    Hub.dispatch(
      "Markers",
      {
        event: "setMarker",
        data: data,
      },
      "map"
    );
  };

  return (
    <>
      {/* Context Provider */}
      <AppContext.Provider
        value={{
          viewportCenter: [
            debouncedViewState.longitude,
            debouncedViewState.latitude,
          ],
          windowSize: windowSize,
          markers: markers,
          route: route,
          routingMode: routingMode,
          truckOptions: truckOptions,
          carOptions: carOptions,
          departureTime: departureTime,
          distanceUnit: distanceUnit,
          units: units,
          isRouting: isRouting,
        }}
      >
        <Header />
        {/* Display map only when transformRequest exists, meaning also credentials have been obtained */}
        {transformRequest ? (
          <Map
            {...viewState}
            mapLib={maplibregl}
            style={{ width: "100vw", height: "calc(100vh - 48px)" }}
            transformRequest={transformRequest}
            mapStyle={mapName}
            onMove={(e) => setViewState(e.viewState)}
            onClick={(e) => handleMapClick(e)}
            ref={mapRef}
            attributionControl={false}
            asyncRender={true}
            touchRotate
            touchZoom
          >
            <Controls />
            <Features />
            {/* Marker toast at the bottom of the screen */}
            <MarkerControl />
            {/* Main routing menu */}
            <RoutingControl />
          </Map>
        ) : (
          // Otherwise just show a loading indicator
          <Flex
            justifyContent="center"
            alignItems="center"
            width="100vw"
            height="calc(100vh - var(--amplify-space-xxl))"
          >
            <Text size="large">Loading...</Text>
          </Flex>
        )}
      </AppContext.Provider>
    </>
  );
}

export default App;
