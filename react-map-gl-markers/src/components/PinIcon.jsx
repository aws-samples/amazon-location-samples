// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { memo } from "react";

// Amazon Location Service Pin that changes colour to orange when selected
const PinIcon = memo(({size, isSelected}) => {
  const style = {
    fill: isSelected ? "#F90" : "#000",
    transform: `translate(${-size/2}px, ${-size}px)`
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 0 24 24" style={style}>
      <circle fill="white" cx="51%" cy="7" r="5" />
      <path d="M 9.43 14.45 C 7.16 11.81 5 10.81 5 7.81 C 5.181 5.62 6.332 3.627 8.138 2.375 C 12.788 -0.848 19.184 2.171 19.65 7.81 C 19.65 10.73 17.59 11.88 15.37 14.39 C 12.31 17.83 13.4 23.66 12.31 23.66 C 11.27 23.66 12.31 17.83 9.43 14.45 Z M 12.31 3.09 C 10.084 3.09 8.28 4.894 8.28 7.12 C 8.28 9.346 10.084 11.15 12.31 11.15 C 14.536 11.15 16.34 9.346 16.34 7.12 C 16.34 4.894 14.536 3.09 12.31 3.09 Z"/>
    </svg>
  );
});

export default PinIcon;