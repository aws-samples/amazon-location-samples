// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { memo } from "react";

const ICON = "M24 9.844l-3.583 6.781-1.084-2.625c-4.05 2.278-5.11 5.961-5.333 10h-4c.189-5.147 1.358-10.246 7.75-13.875l-1.041-2.625 7.291 2.344zm-13.242 3.975c-1.098-1.341-2.558-2.586-4.508-3.694l1.041-2.625-7.291 2.344 3.583 6.781 1.084-2.625c2.018 1.135 3.293 2.62 4.093 4.323.412-1.533 1.046-3.052 1.998-4.504zm1.242-13.819l-5 5h3v5.267c.764.621 1.428 1.268 2.011 1.936.582-.666 1.227-1.316 1.989-1.936v-5.267h3l-5-5z";

const NavigationIcon = memo(function NavigationIcon({ width, height, style }) {
  return (
    <svg
      height={parseInt(height)}
      width={parseInt(width)}
      viewBox={`0 0 ${width} ${height}`}
      style={style}
    >
      <path d={ICON} />
    </svg>
  );
});

export default NavigationIcon;
