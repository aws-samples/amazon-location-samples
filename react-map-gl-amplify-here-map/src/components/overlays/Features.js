// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useContext } from "react";
import { Source, Layer } from "react-map-gl";
import { AppContext, RoutingModesEnum } from "../../AppContext";
import Pin from "./Pin";

const layerStyleWalking = {
  id: "linesLayer",
  type: "line",
  layout: {
    "line-cap": "round",
  },
  paint: {
    "line-width": 5,
    "line-dasharray": [0, 2],
    "line-color": "#5B21B6",
  },
};

const layerStyleDriving = {
  id: "linesLayer",
  type: "line",
  layout: {
    "line-cap": "round",
  },
  paint: {
    "line-color": "#5B21B6",
    "line-width": 5,
  },
};

function Features() {
  const context = useContext(AppContext);

  // If there's no marker don't render anything
  if (context.markers.length === 0) {
    return null;
  }

  // Define style based on routing mode
  const style =
    context.routingMode === RoutingModesEnum.WALKING
      ? layerStyleWalking
      : layerStyleDriving;

  return [
    // Display on Pin for each marker
    context.markers.map((marker, idx) => (
      <Pin
        key={(marker?.geometry && JSON.stringify(marker.geometry)) || 0}
        geometry={marker?.geometry}
        idx={idx}
      />
    )),
    // If there's a route, display it
    Object.keys(context.route).length > 0 ? (
      <Source
        key="source"
        id="my-data"
        type="geojson"
        data={{
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: context.route.Legs[0].Geometry.LineString,
              },
              properties: null,
            },
          ],
        }}
      >
        <Layer {...style} />
      </Source>
    ) : null,
  ];
}

export default Features;
