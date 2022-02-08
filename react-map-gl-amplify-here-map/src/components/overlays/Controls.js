// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useContext } from "react";
import {
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  AttributionControl,
} from "react-map-gl";
import { AppContext } from "../../AppContext";

// Component: Controls - Show the map controls
function Controls() {
  const context = useContext(AppContext);

  return (
    <>
      {context.windowSize.width > 768 ? (
        <NavigationControl position="top-left" />
      ) : null}
      <GeolocateControl
        position="top-left"
        positionOptions={{ enableHighAccuracy: true, timeout: 6000 }}
      />
      {context.windowSize.width > 768 ? (
        <ScaleControl position="bottom-left" />
      ) : null}
      <AttributionControl
        compact={false}
        position="bottom-right"
      />
    </>
  );
}

export default Controls;
