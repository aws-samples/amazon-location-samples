// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useMemo } from "react";
import { Layer, Source } from "react-map-gl";

// Format route data into GeoJSON
const getGeometryJson = (legs) => {
  const features = legs.map((leg) => ({
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: leg.Geometry?.LineString,
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
};

const linePaint = {
  "line-color": "blue",
  "line-width": 2,
  "line-offset": 1.5,
};

const lineLayout = {
  "line-cap": "round",
  "line-join": "round",
};

// Render calculated route path
const CalculatedRoutePath = ({ route }) => {
  const lineJson = useMemo(() => getGeometryJson(route.Legs), [route]);

  return (
    <>
      <Source type="geojson" data={lineJson}>
        <Layer id="line" type="line" paint={linePaint} layout={lineLayout} />
      </Source>
    </>
  );
};

export default CalculatedRoutePath;
