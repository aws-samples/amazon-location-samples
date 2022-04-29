// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState, useMemo, useEffect } from "react";
import { Marker, Popup } from "react-map-gl";
import styles from "./CalculatedRoutePoints.module.css";

// Render calculated route points
const CalculatedRoutePoints = ({ route }) => {
  const [selectedIndex, setSelectedIndex] = useState();

  // Format data for each leg
  const calculatedPositions = useMemo(() => {
    return [
      {
        coordinates: route.Legs[0].StartPosition,
        distance: route.Summary.Distance,
        duration: route.Summary.DurationSeconds,
      },
      ...route.Legs.map((leg) => {
        return {
          coordinates: leg.EndPosition,
          distance: leg.Distance,
          duration: leg.DurationSeconds,
        };
      }),
    ];
  }, [route]);

  // Select first point each time route has been calculated
  useEffect(() => {
    setSelectedIndex(0);
  }, [calculatedPositions]);

  const selectedPoint = calculatedPositions[selectedIndex];
  const radius = 5;

  return (
    <>
      {calculatedPositions.map((point, index) => {
        return (
          <Marker
            latitude={point.coordinates[1]}
            longitude={point.coordinates[0]}
            key={index}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedIndex(index);
            }}
          >
            <div className={styles.point}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
                <circle cx="50%" cy="50%" fill="white" r={radius} strokeWidth="2" stroke="black" />
              </svg>
            </div>
          </Marker>
        );
      })}

      {selectedPoint && (
        <Popup
          latitude={selectedPoint.coordinates[1]}
          longitude={selectedPoint.coordinates[0]}
          offset={[0, radius]}
          closeButton={true}
          closeOnClick={true}
          onClose={() => {
            setSelectedIndex();
          }}
          anchor="top"
          className={styles.popup}
        >
          <div className={styles.popup__content}>
            <div className={styles.popup__title}>
              {selectedIndex === 0 ? "Route Summary" : `Leg ${selectedIndex} Details`}
            </div>
            <div>
              <strong>Distance:</strong> {Math.round(selectedPoint.distance)} km
            </div>
            <div>
              <strong>Duration:</strong> {Math.round(selectedPoint.duration / 60)} min
            </div>
            <div className={styles.popup__title}>
              {selectedIndex === 0 ? "Start Position" : "End Position"}
            </div>
            <div className={styles.popup__coordinates}>
              {`${selectedPoint.coordinates[1].toFixed(6)}, ${selectedPoint.coordinates[0].toFixed(6)}`}
            </div>
          </div>
        </Popup>
      )}
    </>
  );
};

export default CalculatedRoutePoints;
