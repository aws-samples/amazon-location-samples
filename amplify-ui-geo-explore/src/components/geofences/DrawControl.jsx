// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useCallback } from "react";
import { useControl } from "react-map-gl";

// Instantiate mapbox-gl-draw
const draw = new MapboxDraw({
  displayControlsDefault: false,
  defaultMode: "draw_polygon",
  styles: [
    {
      id: "gl-draw-line",
      type: "line",
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#636363",
        "line-width": 2,
      },
    },
    {
      id: "gl-draw-point",
      type: "circle",
      paint: {
        "circle-radius": 6,
        "circle-color": "#7AC943",
      },
    },
  ],
});

// Geofence drawing control using mapbox-gl-draw
const DrawControl = ({ onCreate, onModeChange, onGeofenceCompletable }) => {
  const onRender = () => {
    //mapbox-gl-draw initiates control with two items
    if (draw.getAll().features[0].geometry.coordinates[0].length > 2) {
      onGeofenceCompletable(true);
    }
  };

  // This is needed because the bundler is not making the passed
  // function available to the mapbox-gl-draw library.
  const drawCreate = useCallback((e) => onCreate(e), []);
  const drawModeChange = useCallback((e) => onModeChange(e), []);

  useControl(
    ({ map }) => {
      map.on("draw.create", drawCreate);
      map.on("draw.modechange", drawModeChange);
      map.on("draw.render", onRender);

      return draw;
    },
    ({ map }) => {
      map.off("draw.create", drawCreate);
      map.off("draw.modechange", drawModeChange);
      map.off("draw.render", onRender);
    }
  );

  return null;
};

export default DrawControl;
