// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState } from "react";
import { Marker, Popup } from "react-map-gl";
import PinIcon from "./PinIcon";
import styles from "./LocationMarkers.module.css";

// Render markers with popup on map
const LocationMarkers = ({ markers }) => {
  const iconSize = 45;
  const [selectedMarker, setSelectedMarker] = useState();

  return (
    <>
      {markers?.length > 0 && (
        <>
          {markers.map((marker, index) => {
            return (
              <Marker
                latitude={marker.latitude}
                longitude={marker.longitude}
                offset={[0, -iconSize / 2]}
                key={index}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedMarker(marker);
                }}
                className={styles.marker}
              >
                <PinIcon label={index + 1} size={iconSize} color={marker.color} />
              </Marker>
            );
          })}

          {selectedMarker && (
            <Popup
              latitude={selectedMarker.latitude}
              longitude={selectedMarker.longitude}
              offset={[0, -iconSize]}
              closeButton={true}
              closeOnClick={true}
              onClose={() => setSelectedMarker()}
              anchor="bottom"
              className={styles.popup}
            >
              <div className={styles.popup__content}>
                <div className={styles.popup__title}>
                  {selectedMarker.getPopupTitle(markers.length)}
                </div>
                <div className={styles.popup__coordinates}>
                  {`${selectedMarker.latitude}, ${selectedMarker.longitude}`}
                </div>
              </div>
            </Popup>
          )}
        </>
      )}
    </>
  );
};

export default LocationMarkers;
