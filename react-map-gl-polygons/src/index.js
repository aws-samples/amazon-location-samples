// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StrictMode, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Amplify, { Auth, Geo } from "aws-amplify";
import ReactMapGL, { NavigationControl } from "react-map-gl";
import { AmplifyMapLibreRequest } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";
import "./index.css";
import { 
  IDENTITY_POOL_ID,
  REGION,
  MAP
} from "./configuration";
import PolygonsFeature from "./components/PolygonsFeature";

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

const App = () => {
  const [credentials, setCredentials] = useState();
  const [transformRequest, setRequestTransformer] = useState();
  const [viewport, setViewport] = useState({
    longitude: -123.1187,
    latitude: 49.2819,
    zoom: 11,
  });

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
        >
          <NavigationControl showCompass={false} style={{ left: 20, top: 20 }}/>
          <PolygonsFeature />
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
