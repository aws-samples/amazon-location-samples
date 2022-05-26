// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useMemo } from "react";
import { Source, Layer } from "react-map-gl";

// Format geofence data into GeoJSON
const getGeometryJson = (geofences) => {
  const features = geofences.map((geofence) => ({
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: geofence.Geometry?.Polygon,
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
};

// Properties for the polygons
const polygons = {
  id: "polygons",
  type: "fill",
  source: "drawn-geofences",
  paint: {
    "fill-color": "#56585e",
    "fill-opacity": 0.2,
  },
};

// Drawn geofences on the map
const DrawnGeofences = ({ geofences, geofencesVisible }) => {
  const geofenceJson = useMemo(() => getGeometryJson(geofences), [geofences]);

  if (geofencesVisible) {
    return (
      <Source id="drawn-geofences" type="geojson" data={geofenceJson}>
        <Layer {...polygons} />
      </Source>
    );
  } else {
    return;
  }
};

export default DrawnGeofences;
