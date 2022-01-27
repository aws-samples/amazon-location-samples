// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { MAPS } from "../configuration";
import styles from "./MapControl.module.css";

// Control panel to switch between visibility of different maps
// Map styles are configured in configuration.js
const MapControl = ({ visibleMap, onMapChange }) => {
  return (
    <div className={styles.position}>
      <div className={styles.container}>
        <h4 className={styles.heading}>Map Styles</h4>
        {
          MAPS.map((map, index) => {
            return (
              <label key={index}>
                <input type="radio" name="map-name" checked={visibleMap===map.NAME} onChange={(e) => onMapChange(map.NAME)} />
                {map.LABEL}
              </label>
            );
          })
        }
      </div>
    </div>
  );
}

export default MapControl;