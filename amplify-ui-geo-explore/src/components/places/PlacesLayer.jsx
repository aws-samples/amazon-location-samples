// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { LocationSearch } from "@aws-amplify/ui-react-geo";
import { renderToString } from "react-dom/server";
import PinIcon from "../common/PinIcon";
import styles from "./PlacesLayer.module.css";
import { PIN_ICON_SIZE } from "../../constants";

//Max search results
const MAX_RESULT = 9;

// Override default popup offset
const popup = { offset: [0, -PIN_ICON_SIZE], anchor: "bottom" };

// Override default marker icon
const icon = document.createElement("div");
icon.innerHTML = renderToString(
  <PinIcon size={PIN_ICON_SIZE} color={"rgb(0, 0, 0)"} />
);
const markerIcon = { element: icon, offset: [0, -PIN_ICON_SIZE / 2] };

// Override search box's default style
const render = (item) => {
  // render as a search result
  let placeName = item.text.split(",");
  return renderToString(
    <div className="mapboxgl-ctrl-geocoder--result maplibregl-ctrl-geocoder--result">
      <div>
        <div className="mapboxgl-ctrl-geocoder--result-title maplibregl-ctrl-geocoder--result-title">
          {placeName[0]}
        </div>
        <div className="mapboxgl-ctrl-geocoder--result-address maplibregl-ctrl-geocoder--result-address">
          {placeName.splice(1, placeName.length).join(",")}
        </div>
      </div>
    </div>
  );
};

// Override default popup
const popupRender = (item) => {
  let placeName = item.place_name.split(",");
  return renderToString(
    <div className={styles.popup}>
      <div className={styles.popup__content}>
        <div className={styles.popup__title}>{placeName[0]}</div>
        {placeName.splice(1, placeName.length).join(",")}
        <div className={styles.popup__coordinates}>
          {`${item.center[1].toFixed(6)}, ${item.center[0].toFixed(6)}`}
        </div>
      </div>
    </div>
  );
};

// Layer in the app that contains Places functionalities
const PlacesLayer = () => {
  return (
    <LocationSearch
      position="top-left"
      placeholder="Search Places"
      showResultsWhileTyping={false}
      showResultMarkers={markerIcon}
      popup={popup}
      limit={MAX_RESULT}
      popupRender={popupRender}
      render={render}
      marker={markerIcon}
    />
  );
};

export default PlacesLayer;
