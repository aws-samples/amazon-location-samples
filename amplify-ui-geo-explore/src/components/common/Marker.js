// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export class Marker {
  constructor(coordinates, index) {
    this.setCoordinates(coordinates);
    this.longitude = coordinates?.lng;
    this.latitude = coordinates?.lat;
    this.index = index;
    this.color = "#3eb0ce";
  }

  setCoordinates(coordinates) {
    this.coordinates = [coordinates?.lng, coordinates?.lat];
  }

  getPopupTitle(totalMarkersLength) {
    if (this.index === 0) {
      return "Departure Position";
    } else if (this.index === totalMarkersLength - 1) {
      return "Destination Position";
    } else {
      return "Waypoint Position";
    }
  }
}
