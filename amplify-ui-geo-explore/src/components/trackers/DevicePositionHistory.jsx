// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState, useMemo } from "react";
import { Marker, Popup, Source, Layer } from "react-map-gl";
import { VEHICLE_ICON_SIZE } from "../../constants";
import VehicleIcon from "../common/VehicleIcon";
import styles from "./Devices.module.css";

// Convert position data to GeoJSON line
const getGeoJson = (positions) => {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: positions.map(({ Position }) => Position),
        },
      },
    ],
  };
};

// Style the path using a line
const linePaint = {
  "line-width": 2,
  "line-dasharray": [2, 1],
};

// Display device position history on map
const DevicePositionHistory = ({ deviceHistoryEntries }) => {
  const [selectedHistoryPoint, setSelectedHistoryPoint] = useState();
  // Get GeoJSON line to draw a path for the history of device positions
  const geojson = useMemo(() => getGeoJson(deviceHistoryEntries), [deviceHistoryEntries]);

  return (
    <>
      {deviceHistoryEntries?.length > 0 &&
        deviceHistoryEntries.map((historyPoint, index) => {
          return (
            <Marker
              latitude={historyPoint.Position[1]}
              longitude={historyPoint.Position[0]}
              key={index}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedHistoryPoint(historyPoint);
              }}
            >
              <VehicleIcon
                size={VEHICLE_ICON_SIZE}
                color={index === deviceHistoryEntries.length - 1 ? "#000" : "#6f6f6f"}
              />
            </Marker>
          );
        })}

      {selectedHistoryPoint && (
        <Popup
          latitude={selectedHistoryPoint.Position[1]}
          longitude={selectedHistoryPoint.Position[0]}
          offset={[0, -VEHICLE_ICON_SIZE]}
          closeButton={true}
          closeOnClick={true}
          onClose={() => setSelectedHistoryPoint()}
          anchor="bottom"
          className={styles.popup}
        >
          <div className={styles.popup__content}>
            <div className={styles.popup__title}>{selectedHistoryPoint.DeviceId}</div>
            <div className={styles.popup__coordinates}>
              {`${selectedHistoryPoint.Position[1].toFixed(6)},
              ${selectedHistoryPoint.Position[0].toFixed(6)}`}
            </div>
            <div className={styles.popup__item}>
              <div className={styles.popup__subtitle}>Reported Time</div>
              <div>{new Date(selectedHistoryPoint.SampleTime).toLocaleString()}</div>
            </div>
            {selectedHistoryPoint.PositionProperties && (
              <div className={styles.popup__item}>
                <div className={styles.popup__subtitle}>Position Properties</div>
                {Object.keys(selectedHistoryPoint.PositionProperties).map((key) => (
                  <div key={key}>
                    <strong>{key}: </strong>
                    {selectedHistoryPoint.PositionProperties[key]}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Popup>
      )}

      <Source type="geojson" data={geojson}>
        <Layer id="history-line" type="line" paint={linePaint} />
      </Source>
    </>
  );
};

export default DevicePositionHistory;
