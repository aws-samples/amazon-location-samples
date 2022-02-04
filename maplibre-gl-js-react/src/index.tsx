// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { StrictMode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { createRequestTransformer } from "amazon-location-helpers";
import { ICredentials } from "@aws-amplify/core";
import Amplify from "aws-amplify";
import { Auth } from "aws-amplify";
import ReactMapGL, { MapRequest, NavigationControl, ViewportProps } from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import "./index.css";
import amplifyConfig from "./aws-exports";

Amplify.configure(amplifyConfig);

type RequestTransformFn = (url?: string | undefined, resourceType?: string | undefined) => MapRequest

// Replace with the name of the map that you created on the Amazon Location Service console: https://console.aws.amazon.com/location/maps/home
const mapName = "<MAP_NAME>";

const App = () => {
  const [credentials, setCredentials] = useState<ICredentials>();
  const [transformRequest, setRequestTransformer] = useState<RequestTransformFn>();

  const [viewport, setViewport] = React.useState<Partial<ViewportProps>>({
    longitude: -123.1187,
    latitude: 49.2819,
    zoom: 10,
  });

  useEffect(() => {
    const fetchCredentials = async () => {
      setCredentials(await Auth.currentUserCredentials());
    };

    fetchCredentials();
  }, []);

  // create a new transformRequest function whenever the credentials change
  useEffect(() => {
    const makeRequestTransformer = async () => {
      if (credentials != null) {
        const tr = await createRequestTransformer({
          credentials,
          region: amplifyConfig.aws_project_region,
        });
        // wrap the new value in an anonymous function to prevent React from recognizing it as a
        // function and immediately calling it
        setRequestTransformer(() => tr as unknown as RequestTransformFn);
      }
    };

    makeRequestTransformer();
  }, [credentials]);

  return (
    <div>
      {transformRequest ? (
        <ReactMapGL
          {...viewport}
          width="100%"
          height="100vh"
          transformRequest={transformRequest}
          mapStyle={mapName}
          onViewportChange={setViewport}
        >
          <div style={{ position: "absolute", left: 20, top: 20 }}>
            <NavigationControl showCompass={false} />
          </div>
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
