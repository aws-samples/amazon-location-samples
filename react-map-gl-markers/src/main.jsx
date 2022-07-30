// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Amplify, Auth, Geo } from "aws-amplify";
import maplibregl from "maplibre-gl";
import { AmplifyMapLibreRequest } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import Map, { NavigationControl } from "react-map-gl";
import MarkersFeature from "./components/MarkersFeature";
import LocationPopup from "./components/LocationPopup";
import { IDENTITY_POOL_ID, MAP, REGION } from "./configuration";
import "./index.css";

// Configuring Amplify Geo with existing Amazon Cognito and Amazon Location Service information
// Fill values in configuration.js
Amplify.configure({
  Auth: {
    identityPoolId: IDENTITY_POOL_ID, // REQUIRED - Amazon Cognito Identity Pool ID
    region: REGION, // REQUIRED - Amazon Cognito Region
  },
  geo: {
    AmazonLocationService: {
      maps: {
        items: {
          [MAP.NAME]: {
            // REQUIRED - Amazon Location Service Map resource name
            style: [MAP.STYLE], // REQUIRED - String representing the style of map resource
          },
        },
        default: [MAP.NAME], // REQUIRED - Amazon Location Service Map resource name to set as default
      },
      region: REGION, // REQUIRED - Amazon Location Service Region
    },
  },
});

const App = () => {
  const geoConfig = useMemo(() => Geo.getDefaultMap(), []);
  const [transformRequest, setTransformRequest] = useState();
  const styleProps = useMemo(
    () => ({
      height: "100vh",
      position: "relative",
      width: "100vw",
    }),
    []
  );
  const [popup, setPopup] = useState();

  /**
   * The transformRequest is a callback used by react-map-gl before it makes a request for an external URL. It signs
   * the request with AWS Sigv4 Auth, provided valid credentials, and is how we integrate react-map-gl with Amplify
   * and Amazon Location Service. Once the transformRequest is created, we render the map.
   */
  useEffect(() => {
    (async () => {
      const credentials = await Auth.currentUserCredentials();

      if (credentials) {
        const { region } = geoConfig;
        const { transformRequest: amplifyTransformRequest } =
          new AmplifyMapLibreRequest(credentials, region);
        setTransformRequest(() => amplifyTransformRequest);
      }
    })();
  }, [geoConfig]);

  // Pass data that is needed to display the popup and set that marker as selected
  const handleMarkerClicked = (marker) => {
    const {
      geometry: { coordinates },
      properties: { title, address },
    } = marker;

    // Clicking on the marker will set where the popup will appears and what it displays
    setPopup({
      coordinates,
      title, // Value specified to use 'title' property from GeoJSON data
      description: address, // Value specified to use 'address' property from GeoJSON data
    });
  };

  return (
    <>
      {transformRequest ? (
        <Map
          initialViewState={{
            longitude: -123.1187,
            latitude: 49.2819,
            zoom: 11,
          }}
          mapLib={maplibregl}
          mapStyle={geoConfig.mapName[0]}
          style={styleProps}
          transformRequest={transformRequest}
        >
          <NavigationControl
            showCompass={false}
            style={{ left: 20, top: 20 }}
          />
          <MarkersFeature
            popup={popup}
            handleMarkerClicked={handleMarkerClicked}
          />
          {popup && (
            <LocationPopup
              popupData={popup}
              onPopupClose={() => setPopup(null)}
            />
          )}
        </Map>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
