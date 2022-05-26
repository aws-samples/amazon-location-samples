// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState } from "react";
import { Marker, Popup } from "react-map-gl";
import PinIcon from "./PinIcon";
import styles from "./LocationMarkers.module.css";
import { PIN_ICON_SIZE } from "../../constants";

// Render markers with popup on map
const LocationMarkers = ({ markers }) => {
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
                offset={[0, -PIN_ICON_SIZE / 2]}
                key={index}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedMarker(marker);
                }}
                className={styles.marker}
              >
                <PinIcon label={index + 1} size={PIN_ICON_SIZE} color={marker.color} />
              </Marker>
            );
          })}

          {selectedMarker && (
            <Popup
              latitude={selectedMarker.latitude}
              longitude={selectedMarker.longitude}
              offset={[0, -PIN_ICON_SIZE]}
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
                  {`${selectedMarker.latitude.toFixed(6)}, ${selectedMarker.longitude.toFixed(6)}`}
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
