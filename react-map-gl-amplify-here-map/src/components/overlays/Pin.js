// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from "react";
import { Marker } from "react-map-gl";

// Component: Pin - A basic map marker pin
function Pin(props) {
  const { geometry } = props;

  if (geometry == null || geometry === undefined) {
    return null;
  }

  return (
    <div>
      <Marker
        longitude={geometry.point[0]}
        latitude={geometry.point[1]}
        offsetTop={-20}
        offsetLeft={-10}
        draggable={false}
        color="red"
      />
    </div>
  );
}

export default Pin;
