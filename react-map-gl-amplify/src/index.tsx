// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { ICredentials } from "@aws-amplify/core";
import { Geo, AmazonLocationServiceMapStyle } from "@aws-amplify/geo";
import Amplify, { Auth } from "aws-amplify";
import { AmplifyMapLibreRequest } from "maplibre-gl-js-amplify";
import { StrictMode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ReactMapGL, {
  MapRequest,
  NavigationControl,
  ViewportProps,
} from "react-map-gl";

import awsconfig from "./aws-exports";

import "maplibre-gl/dist/maplibre-gl.css";
import "./index.css";
import { TransformRequestFunction } from "maplibre-gl";

// initialize Amplify (auth, etc.)
Amplify.configure(awsconfig);
// initialize Amplify Geo
Geo.configure(awsconfig);

const App = () => {
  const [credentials, setCredentials] = useState<ICredentials>();
  const [transformRequest, setRequestTransformer] =
    useState<TransformRequestFunction>();

  const [viewport, setViewport] = useState<Partial<ViewportProps>>({
    longitude: -123.1187,
    latitude: 49.2819,
    zoom: 10,
  });

  useEffect(() => {
    // fetch AWS credentials from Amazon Cognito using Amplify Auth
    const fetchCredentials = async () => {
      setCredentials(await Auth.currentUserCredentials());
    };

    fetchCredentials();
  }, []);

  // create a new transformRequest function whenever the credentials change
  useEffect(() => {
    const makeRequestTransformer = async () => {
      if (credentials != null) {
        const { transformRequest } = new AmplifyMapLibreRequest(
          credentials,
          (Geo.getDefaultMap() as AmazonLocationServiceMapStyle).region
        );

        // wrap the new value in an anonymous function to prevent React from recognizing it as a
        // function and immediately calling it
        setRequestTransformer(() => transformRequest);
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
          transformRequest={
            transformRequest as (
              url?: string,
              resourceType?: string
            ) => MapRequest
          }
          mapStyle={Geo.getDefaultMap().mapName}
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
