// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { memo } from "react";
import { Marker } from "react-map-gl";

const ICON = "M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z";

// Memoized SVG icon
const Icon = memo(function Icon() {
  return (
    <svg
      height={32}
      viewBox="0 0 24 24"
      className={"fill-current text-red-600"}
      style={{ stroke: "#000", strokeWidth: 1.5 }}
    >
      <path d={ICON} />
    </svg>
  );
});

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
      >
        <Icon />
      </Marker>
    </div>
  );
}

export default Pin;
