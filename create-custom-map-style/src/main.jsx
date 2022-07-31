// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import "@aws-amplify/ui-react/styles.css";
import { Amplify, Auth, Geo } from "aws-amplify";
import maplibregl from "maplibre-gl";
import { AmplifyMapLibreRequest } from "maplibre-gl-js-amplify";
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import Map, { NavigationControl } from "react-map-gl";
import awsExports from "./aws-exports";
import style from "./example-style-descriptor.json";

Amplify.configure(awsExports);

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
          mapStyle={style}
          style={styleProps}
          transformRequest={transformRequest}
        >
          <NavigationControl
            showCompass={false}
            style={{ left: 20, top: 20 }}
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
