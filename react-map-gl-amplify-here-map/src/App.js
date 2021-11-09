// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMapGL, {
  FlyToInterpolator,
  WebMercatorViewport,
} from "react-map-gl";
import Controls from "./Controls";
import { Hub } from "@aws-amplify/core";
import useAmazonLocationService from "./useAmazonLocationService";
import useDebounce from "./useDebounce";
import {
  AppContext,
  defaultState,
  RoutingModesEnum,
  UnitsEnum,
} from "./AppContext";
import useWindowSize from "./useWindowSize";
import Features from "./Features";
import MarkerToast from "./MarkerToast";
import RoutingMenu from "./routing/RoutingMenu";
import { Geo } from "@aws-amplify/geo";

function App() {
  // Setting state variables
  const [viewport, setViewport] = useState({
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
  const [isSettingAdditionalMarkers, setAdditionalMarkers] = useState(false);
  // Setting refs
  const mapRef = useRef();
  const isRouteZoomedRef = useRef(false);
  const isPointZoomed = useRef(false);
  // Setting hooks
  const windowSize = useWindowSize();
  const debouncedViewport = useDebounce(viewport, 500);
  const [transformRequest, mapName, calculateRoute] =
    useAmazonLocationService();

  // TODO: check if this is needed
  /* useEffect(() => {
    if (mapRef.current) {
      console.log(debouncedViewport);
      console.log(mapRef.current.getMap().getBounds());
      // Cache.setItem('viewport', )
    }
  }, [debouncedViewport]); */

  // Functions that moves the viewport so that it fits a route once it is calculated
  const zoomToRoute = useCallback((routeBBox, viewport) => {
    console.debug("Fitting route bbox to viewport", routeBBox);
    // Creating a new viewport object http://visgl.github.io/react-map-gl/docs/api-reference/web-mercator-viewport
    const vp = new WebMercatorViewport(viewport);
    // Fit the route to the viewport
    const { longitude, latitude, zoom } = vp.fitBounds(
      [
        [routeBBox[0], routeBBox[1]],
        [routeBBox[2], routeBBox[3]],
      ],
      {
        padding: {
          top: 50,
          bottom: 50,
          left: 50,
          right: viewport.width > 768 ? 450 : 50,
        },
      }
    );
    // Set the new viewport with interpolator http://visgl.github.io/react-map-gl/docs/api-reference/fly-to-interpolator
    setViewport({
      ...viewport,
      longitude,
      latitude,
      zoom,
      transitionInterpolator: new FlyToInterpolator({ speed: 0.8 }),
      transitionDuration: "auto",
    });
  }, []);

  const zoomToPoint = useCallback((lngLat, viewport) => {
    console.debug("Fitting point to viewport", lngLat);
    const [longitude, latitude] = lngLat;
    setViewport({
      ...viewport,
      longitude,
      latitude,
      zoom: 15,
      transitionInterpolator: new FlyToInterpolator({ speed: 0.8 }),
      transitionDuration: "auto",
    });
  }, []);

  // Reset the view to default values
  const resetView = () => {
    setRouting(defaultState.isRouting);
    setMarkers(defaultState.markers);
    setRoute(defaultState.route);
    setRoutingMode(defaultState.routingMode);
    setAdditionalMarkers(false);
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
      zoomToRoute(route.Summary.RouteBBox, debouncedViewport);
    }
  }, [route, debouncedViewport, zoomToRoute]);

  useEffect(() => {
    if (markers.length === 1 && !isPointZoomed.current) {
      isPointZoomed.current = true;
      zoomToPoint(markers[0].geometry.point, debouncedViewport);
    }
  }, [markers, debouncedViewport, zoomToPoint]);

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
      // Set a marker and reverse geocode
    } else if (payload.event === "setMarkers") {
      const newMarkers = [...markers];
      for (const el of payload.data) {
        if (el.idx === 0) isPointZoomed.current = false;
        try {
          const res = await Geo.searchByCoordinates(el.lngLat);
          newMarkers[el.idx] = {
            ...res,
            source: data.source,
          };
        } catch (error) {
          console.log(error);
        }
      }

      console.debug(newMarkers);
      setMarkers(newMarkers);
      // Set a marker without reverse geocoding
    } else if (payload.event === "setMarkerNoGeocode") {
      console.debug("Setting marker without geocode", payload.data);
      const newMarkers = [...markers];
      newMarkers[payload.data.idx] = {
        ...payload.data.marker,
        source: data.source,
      };
      if (payload.data.idx === 0) isPointZoomed.current = false;
      console.debug(newMarkers);
      setMarkers(newMarkers);
    }
  };

  // Action router that handles Viewport events from the Hub
  const handleViewport = (data) => {
    // Update viewport
    if (data.payload.event === "update") {
      setViewport(data.payload.data);
      // Toggle 3D mode for the map on mobile
    } else if (data.payload.event === "toggle3D") {
      console.debug("Toggling 3D Mode", viewport);
      const newViewport = {
        ...viewport,
        pitch: 45,
        zoom: 15,
        transitionInterpolator: new FlyToInterpolator({ speed: 0.8 }),
        transitionDuration: "auto",
      };
      setViewport(newViewport);
    }
  };

  const handleUserLocation = (data) => {
    // if (data.payload.event === '')
  };

  // Side effects that runs when the component mounts and subscribes to the Hub
  useEffect(() => {
    Hub.listen("Viewport", handleViewport);
    Hub.listen("Markers", handleMarkers);
    Hub.listen("Routing", handleRouting);
    Hub.listen("UserLocation", handleUserLocation);

    // Clean up subscriptions when the component unmounts
    return () => {
      Hub.remove("Viewport", handleViewport);
      Hub.remove("Markers", handleMarkers);
      Hub.remove("Routing", handleRouting);
      Hub.remove("UserLocation", handleUserLocation);
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
    // If there's no marker, then we set one
    if (markers.length === 0) {
      data = [{ idx: 0, lngLat: lngLat }];
      // If there's already a marker (plus a placehoder), then we set one in the first position (origin)
    } else if (markers.length === 2 && !isSettingAdditionalMarkers) {
      data = [{ idx: 0, lngLat: lngLat }];
      // If there are already two markers, then we just append a new one
    } else if (markers.length >= 2 && isSettingAdditionalMarkers) {
      data = [{ idx: markers.length, lngLat: lngLat }];
    }

    // Dispatch event with constructed payload
    Hub.dispatch(
      "Markers",
      {
        event: "setMarkers",
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
            debouncedViewport.longitude,
            debouncedViewport.latitude,
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
        <header className="w-full h-12 py-1 px-4 flex">
          <div className="w-1/3 block">
            <a href={window.location.href}>
              <img
                className="h-10"
                src="/aws_logo.svg"
                alt="Amazon Web Services"
              />
            </a>
          </div>
          <div className="w-2/3 flex justify-end items-center">
            <a
              href="https://developer.here.com/blog"
              alt="Blog Post on Here Developer Blog"
              className="ml-4"
            >
              Learn More
            </a>
            <a
              href="https://github.com/aws-samples/amazon-location-samples/tree/main/"
              alt="Source Code on GitHub"
              className="ml-4"
            >
              Source Code
            </a>
            <a
              href="https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/aws-samples/amazon-location-samples/tree/main/"
              className="ml-4 hidden md:block"
            >
              <img
                src="https://oneclick.amplifyapp.com/button.svg"
                alt="Deploy to Amplify Console"
              />
            </a>
          </div>
        </header>
        {/* Display map only when transformRequest exists, meaning also credentials have been obtained */}
        {transformRequest ? (
          <ReactMapGL
            {...viewport}
            width="100vw"
            height="calc(100vh - 48px)"
            transformRequest={transformRequest}
            mapStyle={mapName}
            onViewportChange={setViewport}
            onClick={(e) => handleMapClick(e)}
            ref={mapRef}
            attributionControl={false}
            asyncRender={true}
            touchRotate
            touchZoom
          >
            <Controls />
            <Features />
          </ReactMapGL>
        ) : (
          // Otherwise just show a loading indicator
          <div
            className="flex justify-center items-center"
            id="loading-overlay"
          >
            <h1 className="text-xl">Loading...</h1>
          </div>
        )}
        {/* Marker toast at the bottom of the screen */}
        <MarkerToast />
        {/* Main routing menu */}
        <RoutingMenu />
      </AppContext.Provider>
    </>
  );
}

export default App;
