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
  MAPS
} from "./configuration";
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
          [MAPS[0].NAME]: { // REQUIRED - Amazon Location Service Map resource name
            style: [MAPS[0].STYLE] // REQUIRED - String representing the style of map resource
          },
        },
        default: [MAPS[0].NAME], // REQUIRED - Amazon Location Service Map resource name to set as default
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
    zoom: 6,
  });
  
  // Initial map is from configuration.js
  const [visibleMap, setVisibleMap] = useState(MAPS[0].NAME);

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

  // Update the state for which map style is used
  const handleMapChange = (map) => {
    setVisibleMap(map)
  }

  return (
    <div>
      {transformRequest ? (
        <ReactMapGL
          {...viewport}
          width="100%"
          height="100vh"
          transformRequest={transformRequest}
          mapStyle={visibleMap}
          onViewportChange={setViewport}
        >
          <NavigationControl showCompass={false} style={{ left: 20, top: 20 }}/>
          <MapControl visibleMap={visibleMap} onMapChange={handleMapChange} />
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
