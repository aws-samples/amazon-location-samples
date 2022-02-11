import { memo } from "react";
import { Source, Layer } from 'react-map-gl';

const LineOverlay = ({ trackerPositions }) => {
  if (trackerPositions.length === 0) return null;
  const layerStyle = {
    id: "linesLayer",
    type: "line",
    layout: {
      "line-cap": "round",
    },
    paint: {
      "line-color": "purple",
      "line-width": 5,
    },
  };

  return (
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
              coordinates: trackerPositions.map(position => [position.Position[0], position.Position[1]]),
            },
            properties: null,
          },
        ],
      }}
    >
      <Layer {...layerStyle} />
    </Source>
  );
};

export default memo(LineOverlay);