// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useContext } from "react";
import {
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  AttributionControl,
  MapContext,
} from "react-map-gl";
import { Hub } from "@aws-amplify/core";
import { AppContext } from "../../AppContext";

// Component: Controls - Show the map controls
function Controls() {
  const mapContext = useContext(MapContext);
  const context = useContext(AppContext);

  return (
    <>
      <div
        className={`z-50 absolute flex left-1 md:left-5 bottom-1 md:top-5 justify-end md:justify-start flex-col h-48`}
      >
        {context.windowSize.width > 768 ? (
          <NavigationControl
            className="static mb-4"
            // http://visgl.github.io/react-map-gl/docs/api-reference/geolocate-control#style
            style={{ position: "static" }}
          />
        ) : null}
        <GeolocateControl
          style={{ position: "static" }}
          className="static"
          positionOptions={{ enableHighAccuracy: true, timeout: 6000 }}
          onViewportChange={(e) => {
            e.zoom = mapContext.viewport.zoom;
            Hub.dispatch("Viewport", { event: "update", data: e });
          }}
          onGeolocate={(e) => {
            console.debug(e);
          }}
        />
      </div>
      {context.windowSize.width > 768 ? (
        <ScaleControl style={{ position: "absolute", left: 20, bottom: 20 }} />
      ) : null}
      <AttributionControl
        compact={false}
        className="absolute bottom-1 md:bottom-5 right-1 md:right-5 bg-gray-300 opacity-90 text-sm "
      />
    </>
  );
}

export default Controls;
