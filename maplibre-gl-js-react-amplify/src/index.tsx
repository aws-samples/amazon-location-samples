// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import Amplify from "aws-amplify";
import { Map, NavigationControl } from "maplibre-gl";
import { createMap } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";
import { StrictMode, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import awsconfig from "./aws-exports";
import "./index.css";

// initialize Amplify
Amplify.configure(awsconfig);

const App = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map>();

  useEffect(() => {
    async function initializeMap() {
      if (mapRef.current != null) {
        const map = await createMap({
          container: mapRef.current,
          center: [-123.1187, 49.2819],
          zoom: 11,
        });

        setMap(map);
      }
    }

    initializeMap();
  }, [mapRef]);

  useEffect(() => {
    if (map != null) {
      // configure the Map instance with controls, custom layers, behaviors, etc.
      map.addControl(new NavigationControl(), "top-left");
    }
  }, [map]);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
};

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
