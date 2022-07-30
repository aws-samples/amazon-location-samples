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
import { IDENTITY_POOL_ID, REGION, MAP } from "./configuration";
import ClustersFeature from "./components/ClustersFeature";
import LocationPopup from "./components/LocationPopup";

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

// Style for AttributionControl component
const attributionStyle = {
  right: 0,
  bottom: 0,
  fontSize: "12px",
};

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

  // Pass data that is needed for the popup to be displayed when an unclustered point is clicked
  const handleClick = (e) => {
    e.originalEvent.stopPropagation();
    const feature = e.features && e.features[0];

    // Checking for click events on unclustered points
    if (feature?.layer?.id === "points") {
      // Clicking on an unclustered point will set where the popup will appears and what it displays
      setPopup({
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        title: feature.properties.title, // Value specified to use 'title' property from GeoJSON data
        description: String(new Date(feature.properties.time)), // Value specified to use 'time' property from GeoJSON data
      });
    }
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
          mapStyle={geoConfig.mapName[0]}
          style={styleProps}
          transformRequest={transformRequest}
          onClick={handleClick}
          interactiveLayerIds={["points"]} // 'points' layer from clusters to have a pointer cursor when hovered
          attributionControl={false} // We are using the AttributionControl component instead to add custom attribution
        >
          <NavigationControl
            showCompass={false}
            style={{ left: 20, top: 20 }}
          />
          <AttributionControl
            compact={false}
            style={attributionStyle}
            customAttribution="Earthquake data courtesy of the U.S. Geological Survey"
          />
          <ClustersFeature />
          {popup && (
            <LocationPopup popupData={popup} onPopupClose={() => setPopup()} />
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
