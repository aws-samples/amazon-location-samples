// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Amplify, Auth, Geo } from "aws-amplify";
import Map, { NavigationControl, AttributionControl } from "react-map-gl";
import { AmplifyMapLibreRequest } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import "./index.css";
import { IDENTITY_POOL_ID, REGION, MAPS } from "./configuration";
import MapControl from "./components/MapControl";

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
          [MAPS[0].NAME]: {
            // REQUIRED - Amazon Location Service Map resource name
            style: [MAPS[0].STYLE], // REQUIRED - String representing the style of map resource
          },
          [MAPS[1].NAME]: {
            // REQUIRED - Amazon Location Service Map resource name
            style: [MAPS[1].STYLE], // REQUIRED - String representing the style of map resource
          },
        },
        default: [MAPS[0].NAME], // REQUIRED - Amazon Location Service Map resource name to set as default
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
  // Initial map is from configuration.js
  const [visibleMap, setVisibleMap] = useState(geoConfig.mapName[0]);

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

  // Update the state for which map style is used
  const handleMapChange = (map) => {
    setVisibleMap(map);
  };

  return (
    <>
      {transformRequest ? (
        <Map
          initialViewState={{
            longitude: -123.1187,
            latitude: 49.2819,
            zoom: 6,
          }}
          mapLib={maplibregl}
          mapStyle={visibleMap}
          style={styleProps}
          transformRequest={transformRequest}
        >
          <NavigationControl
            showCompass={false}
            style={{ left: 20, top: 20 }}
          />
          <MapControl
            maps={Geo.getAvailableMaps()}
            visibleMap={visibleMap}
            onMapChange={handleMapChange}
          />
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
