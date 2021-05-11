// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

import React, { PureComponent } from "react";
import pin from "./pin.png";
import "./CityPin.css";

const pinStyle = {
  cursor: "pointer",
  fill: "#d00",
  stroke: "none",
};

export default class CityPin extends PureComponent {
  render() {
    const { trackerData, size = 40, onClick, curr } = this.props;
    const timestamp = new Date(trackerData.SampleTime);
    const data = {
      longitude: trackerData.Position[0],
      latitude: trackerData.Position[1],
      date: timestamp.toDateString(),
      time: timestamp.toTimeString(),
    };

    return (
      <img
        height={size}
        viewBox="0 0 24 24"
        style={{
          ...pinStyle,
          transform: `translate(${-size / 2}px,${-size}px)`,
        }}
        onClick={() => onClick(data)}
        src={pin}
        className={curr ? "blink-img" : ""}
      />
    );
  }
}
