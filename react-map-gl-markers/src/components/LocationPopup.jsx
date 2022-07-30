// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Popup } from "react-map-gl";

// Display a popup that appears when markers are clicked
const LocationPopup = ({ popupData, onPopupClose }) => {
  return (
    <Popup
      longitude={popupData.coordinates[0]}
      latitude={popupData.coordinates[1]}
      offset={[-17, -55]}
      closeButton={true}
      closeOnClick={true}
      onClose={onPopupClose}
      anchor="bottom"
    >
      <div>
        <div>
          <strong>{popupData.title}</strong>
        </div>
        <div>{popupData.description}</div>
      </div>
    </Popup>
  );
};

export default LocationPopup;
