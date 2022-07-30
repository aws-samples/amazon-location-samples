// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Source, Layer } from "react-map-gl";
import geojsonData from "../data/VancouverBoundary.json"; // Boundary of Vancouver

// Properties for the polygons layer
const polygonsLayer = {
  id: "polygons",
  type: "fill",
  source: "polygons-source",
  paint: {
    "fill-color": "#9f34ff",
    "fill-opacity": 0.3,
  },
};

// Display polygons from GeoJSON data.
const PolygonsFeature = () => {
  return (
    // Create a source that specifies which data it should display
    <Source id="polygons-source" type="geojson" data={geojsonData}>
      {/* Create a map layer to display the polygons */}
      <Layer {...polygonsLayer} />
    </Source>
  );
};

export default PolygonsFeature;
