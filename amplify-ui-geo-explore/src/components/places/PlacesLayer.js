// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Geocoder } from "@aws-amplify/ui-react";
import { renderToString } from "react-dom/server";
import PinIcon from "../common/PinIcon";
import styles from "./PlacesLayer.module.css";

//Max search results
const MAX_RESULT = 9;

// Override default popup offset
const popup = { offset: [0, -25] };

// Override default marker icon
const icon = document.createElement("div");
icon.innerHTML = renderToString(<PinIcon size={45} color={"rgb(0, 0, 0)"} />);

// Override search box's default style
const render = (item) => {
  // Render as a suggestion
  if (typeof item === "string") {
    let suggestionName = item.split(",");
    let indexOfMatch = suggestionName[0].toLowerCase().indexOf(this.query.toLowerCase());
    let lengthOfMatch = this.query.length;
    let beforeMatch = suggestionName[0].substring(0, indexOfMatch);
    let match = suggestionName[0].substring(indexOfMatch, indexOfMatch + lengthOfMatch);
    let afterMatch = suggestionName[0].substring(indexOfMatch + lengthOfMatch);
    return renderToString(
      <div className="mapboxgl-ctrl-geocoder--suggestion maplibregl-ctrl-geocoder--suggestion">
        <PinIcon size={32} isSelected={false} color={"rgb(0, 0, 0)"} />
        <div className="mapboxgl-ctrl-geocoder--suggestion-info maplibregl-ctrl-geocoder--suggestion-info">
          <div className="mapboxgl-ctrl-geocoder--suggestion-title maplibregl-ctrl-geocoder--suggestion-title">
            {beforeMatch}
            <span className="mapboxgl-ctrl-geocoder--suggestion-match maplibregl-ctrl-geocoder--suggestion-match">
              {match}
            </span>
            {afterMatch}
          </div>
          <div className="mapboxgl-ctrl-geocoder--suggestion-address maplibregl-ctrl-geocoder--suggestion-address">
            {suggestionName.splice(1, suggestionName.length).join(",")}
          </div>
        </div>
      </div>
    );
  } else {
    // render as a search result
    let placeName = item.place_name.split(",");
    return renderToString(
      <div className="mapboxgl-ctrl-geocoder--result maplibregl-ctrl-geocoder--result">
        <PinIcon size={32} isSelected={false} color={"rgb(0, 0, 0)"} />
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
  }
};

// Override default popup
const popupRender = (item) => {
  let placeName = item.place_name.split(",");
  return renderToString(
    <div className={styles.popup}>
      <div className={styles.popup__content}>
        <div className={styles.popup__title}>{placeName[0]}</div>
        {placeName.splice(1, placeName.length).join(",")}
        <div className={styles.popup__coordinates}>{`${item.center[1]}, ${item.center[0]}`}</div>
      </div>
    </div>
  );
};

// Layer in the app that contains Places functionalities
const PlacesLayer = () => {
  return (
    <Geocoder
      position="top-left"
      placeholder="Search Places"
      showResultsWhileTyping={false}
      showResultMarkers={{ element: icon }}
      popup={popup}
      limit={MAX_RESULT}
      popupRender={popupRender}
      render={render}
      marker={{ element: icon }}
    />
  );
};

export default PlacesLayer;
