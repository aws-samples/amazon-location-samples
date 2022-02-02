// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StrictMode, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Amplify, { Auth, Geo } from "aws-amplify";
import ReactMapGL, { NavigationControl, AttributionControl } from "react-map-gl";
import { AmplifyMapLibreRequest } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";
import "./index.css";
import { 
  IDENTITY_POOL_ID,
  REGION,
  MAP,
} from "./configuration";
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
          [MAP.NAME]: { // REQUIRED - Amazon Location Service Map resource name
            style: [MAP.STYLE] // REQUIRED - String representing the style of map resource
          },
        },
        default: [MAP.NAME], // REQUIRED - Amazon Location Service Map resource name to set as default
      },
      region: REGION, // REQUIRED - Amazon Location Service Region
    },
  }
});

// Style for AttributionControl component
const attributionStyle= {
  right: 0,
  bottom: 0,
  fontSize: "12px"
};

const App = () => {
  const [credentials, setCredentials] = useState();
  const [transformRequest, setRequestTransformer] = useState();
  const [viewport, setViewport] = useState({
    longitude: -123.1187,
    latitude: 49.2819,
    zoom: 6,
  });
  const [popup, setPopup] = useState();

  //Fetch credentials when the app loads
  useEffect(() => {
    const fetchCredentials = async () => {

      // Fetch AWS credentials from Amazon Cognito using Amplify Auth and storing it in state
      setCredentials(await Auth.currentUserCredentials());
    };
    fetchCredentials();
  }, []);

  // Create a new transformRequest function whenever the credentials change
  useEffect(() => {
    if (credentials != null) {

      // transformRequest is used to sign the request with AWS Sigv4 Auth
      const { transformRequest } = new AmplifyMapLibreRequest(
        credentials,
        Geo.getDefaultMap().region
      );

      // Wrap the new value in an anonymous function to prevent React from recognizing it as a function and immediately calling it
      setRequestTransformer(() => transformRequest);
    }
  }, [credentials]);


  // Pass data that is needed for the popup to be displayed when an unclustered point is clicked
  const handleClick = (e) => {
    const feature = e.features && e.features[0];

    // Checking for click events on unclustered points
    if(feature?.layer?.id === "points") {

      // Clicking on an unclustered point will set where the popup will appears and what it displays
      setPopup({
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
        title: feature.properties.title, // Value specified to use 'title' property from GeoJSON data
        description: String(new Date(feature.properties.time)), // Value specified to use 'time' property from GeoJSON data
      });
    }
  }

  // Reset the popup state when closed
  const handlePopupClose = () => {
    setPopup();
  }

  return (
    <div>
      {transformRequest ? (
        <ReactMapGL
          {...viewport}
          width="100%"
          height="100vh"
          transformRequest={transformRequest}
          mapStyle={MAP.NAME}
          onViewportChange={setViewport}
          onClick={handleClick}
          interactiveLayerIds={["points"]} // 'points' layer from clusters to have a pointer cursor when hovered
          attributionControl={false} // We are using the AttributionControl component instead to add custom attribution
        >
          <NavigationControl showCompass={false} style={{ left: 20, top: 20 }}/>
          <AttributionControl compact={false} style={attributionStyle} customAttribution="Earthquake data courtesy of the U.S. Geological Survey" />
          <ClustersFeature />
          {popup && <LocationPopup popupData={popup} onPopupClose={handlePopupClose} />}
        </ReactMapGL>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
