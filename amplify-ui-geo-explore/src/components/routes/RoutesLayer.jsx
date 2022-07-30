// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useEffect, useState } from "react";
import { CalculateRouteCommand } from "@aws-sdk/client-location";
import { Button } from "@aws-amplify/ui-react";
import { useMap } from "react-map-gl";
import { ROUTE } from "../../configuration";
import LocationMarkers from "../common/LocationMarkers";
import RoutesPanel from "./RoutesPanel";
import CalculatedRoutePath from "./CalculatedRoutePath";
import CalculatedRoutePoints from "./CalculatedRoutePoints";
import { Marker } from "../common/Marker";
import { ROUTES_PANEL } from "../../constants";

// Get calculated route result
const callCalculateRouteCommand = async (client, markers, options) => {
  if (client && markers.length > 1) {
    const command = new CalculateRouteCommand({
      CalculatorName: ROUTE,
      IncludeLegGeometry: true,
      DeparturePosition: markers[0].coordinates,
      DestinationPosition: markers[markers.length - 1].coordinates,
      WaypointPositions:
        markers.length > 2 ? markers.slice(1, -1).map((marker) => marker.coordinates) : undefined,
      TravelMode: options.travelMode,
      DepartNow: options.departureTimeMode === "now" ? true : false,
      DepartureTime: options.departureTimeMode === "future" ? options.departureDateTime : undefined,
    });

    return client.send(command);
  } else {
    alert("Set a departure and destination point on the map before calculating the route.");
  }
};

// Layer in the app that contains Routes functionalities
const RoutesLayer = ({
  client,
  clickedLngLat,
  isOpenedPanel,
  onPanelChange,
}) => {
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState();
  const [index, setIndex] = useState(0);
  const { current: map } = useMap();

  useEffect(() => {
    // Store clicked coordinates into markers to be displayed on the map only when routes panel is open
    if (clickedLngLat && isOpenedPanel) {
      const markerData = new Marker(clickedLngLat, index);
      setMarkers((current) => [...current, markerData]);
      setIndex(index + 1);
    }
  }, [clickedLngLat]);

  const handleCalculate = async (options) => {
    try {
      const calculatedRoute = await callCalculateRouteCommand(client, markers, options);
      if (calculatedRoute) {
        // Update viewport to fit calculated route
        const boundingBox = calculatedRoute.Summary.RouteBBox;
        map.fitBounds(
          [
            [boundingBox[0], boundingBox[1]],
            [boundingBox[2], boundingBox[3]],
          ],
          {
            padding: {
              top: 200,
              bottom: 200,
              left: 100,
              right: 500,
            },
            speed: 0.8,
            linear: false,
          }
        );
        setRoute(calculatedRoute);
      }
    } catch {
      alert("There was an error calculating the route.");
    }
  };

  const handleReset = () => {
    setMarkers([]);
    setRoute();
    setIndex(0);
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "0.59rem",
          left: "24.1rem",
        }}
      >
        <Button
          onClick={() => {
            isOpenedPanel ? onPanelChange() : onPanelChange(ROUTES_PANEL);
          }}
          backgroundColor="white"
          size="small"
          gap="0.5rem"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 10px 2px" }}
        >
          <div style={{ display: "flex", width: "24px" }}>
            <svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.293,7 L17.793,7 L17.793,5 L14.293,5 L14.293,7 Z M19.793,7 L23.293,7 L23.293,5 L19.793,5 L19.793,7 Z M32.352,14.813 L33.768,13.4 L36.24,15.877 L34.824,17.291 L32.352,14.813 Z M25.142,7.587 C25.018,7.462 24.877,7.355 24.725,7.268 L25.719,5.532 C26.025,5.708 26.308,5.924 26.558,6.175 L28.47,8.091 L27.054,9.503 L25.142,7.587 Z M28.467,10.919 L29.883,9.506 L32.355,11.984 L30.939,13.397 L28.467,10.919 Z M13.148,33.778 L14.539,35.216 L12.382,37.301 L10.991,35.862 L13.148,33.778 Z M29.253,33.532 C29.312,33.586 29.379,33.635 29.45,33.674 L28.483,35.424 C28.272,35.308 28.075,35.166 27.897,35.002 L26.048,33.294 L27.405,31.825 L29.253,33.532 Z M19.112,28.017 C19.734,27.415 20.597,27.113 21.453,27.186 L21.285,29.179 C20.957,29.174 20.689,29.274 20.502,29.455 L19.572,30.353 L18.184,28.914 L19.112,28.017 Z M23.732,28.433 L25.937,30.468 L24.579,31.937 L22.375,29.902 L23.732,28.433 Z M16.746,30.304 L18.135,31.742 L15.977,33.827 L14.588,32.388 L16.746,30.304 Z M6,44 C4.897,44 4,43.103 4,42 C4,40.897 4.897,40 6,40 C7.103,40 8,40.897 8,42 C8,43.103 7.103,44 6,44 L6,44 Z M9.553,37.252 L8.13,38.627 C7.512,38.235 6.784,38 6,38 C3.794,38 2,39.794 2,42 C2,44.206 3.794,46 6,46 C8.206,46 10,44.206 10,42 C10,41.305 9.807,40.661 9.493,40.091 L10.943,38.69 L9.553,37.252 Z M32.179,31.729 L33.69,33.039 L32.199,34.761 C31.96,35.036 31.679,35.263 31.36,35.435 L30.407,33.677 C30.513,33.62 30.607,33.543 30.688,33.451 L32.179,31.729 Z M35.452,27.949 L36.964,29.258 L35,31.526 L33.488,30.217 L35.452,27.949 Z M6,4 C7.103,4 8,4.897 8,6 C8,7.103 7.103,8 6,8 C4.897,8 4,7.103 4,6 C4,4.897 4.897,4 6,4 L6,4 Z M6,10 C7.858,10 9.411,8.72 9.858,7 L12.293,7 L12.293,5 L9.858,5 C9.411,3.28 7.858,2 6,2 C3.794,2 2,3.794 2,6 C2,8.206 3.794,10 6,10 L6,10 Z M42,24 C40.897,24 40,23.103 40,22 C40,20.897 40.897,20 42,20 C43.103,20 44,20.897 44,22 C44,23.103 43.103,24 42,24 L42,24 Z M42,18 C40.988,18 40.073,18.39 39.368,19.012 L37.652,17.293 L36.236,18.706 L38.233,20.707 C38.093,21.115 38,21.545 38,22 C38,22.822 38.25,23.587 38.678,24.223 L36.761,26.437 L38.272,27.747 L40.182,25.542 C40.729,25.825 41.342,26 42,26 C44.206,26 46,24.206 46,22 C46,19.794 44.206,18 42,18 L42,18 Z"></path>
            </svg>
          </div>
          Routes
        </Button>
      </div>
      {isOpenedPanel && (
        <RoutesPanel
          onClose={() => onPanelChange()}
          onCalculate={handleCalculate}
          onReset={handleReset}
          departurePosition={
            markers[0]
              ? `${markers[0]?.latitude.toFixed(6)}, ${markers[0]?.longitude.toFixed(6)}`
              : undefined
          }
          destinationPosition={
            markers[markers.length - 1] && markers.length > 1
              ? `${markers[markers.length - 1]?.latitude.toFixed(6)}, ${markers[
                  markers.length - 1
                ]?.longitude.toFixed(6)}`
              : undefined
          }
        />
      )}
      {markers && <LocationMarkers markers={markers} />}
      {route && <CalculatedRoutePath route={route} />}
      {route && <CalculatedRoutePoints route={route} />}
    </>
  );
};

export default RoutesLayer;
