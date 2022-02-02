// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Source, Layer } from "react-map-gl";
import geoJsonData from "../data/Earthquakes.json"; // Earthquakes from 2011 to 2021 with minimum magnitude of 6 (Earthquake data courtesy of the U.S. Geological Survey)

// Properties for clusters layer when zoomed out
const clustersLayer = {
  id: "clusters",
  type: "circle",
  source: "clusters-source",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step", 
      ["get", "point_count"], 
      "#a6caf3", 
      10, 
      "#fdd2a2", 
      25, 
      "#f39f9e"
    ],
    "circle-radius": [
      "step", 
      ["get", "point_count"], 
      30, 
      10, 
      40, 
      25, 
      50
    ]
  }
};

// Properties for points layer when zoomed in
const pointsLayer = {
  id: "points",
  type: "circle",
  source: "clusters-source",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#fff",
    "circle-radius": 3,
    "circle-stroke-width": 4,
    "circle-stroke-color": "#f25a59"
  }
};

// Displays clusters from GeoJSON data.
const ClustersFeature = () => {
  return (

    // Create a source that specifies which data it should display
    <Source
      id="clusters-source"
      type="geojson"
      data={geoJsonData}
      cluster={true}
      clusterMaxZoom={14}
      clusterRadius={60}
    >

      {/* Create a map layer to display clusters or points based on the zoom */}
      <Layer {...clustersLayer} />
      <Layer {...pointsLayer} />
    </Source>
  );
}

export default ClustersFeature;