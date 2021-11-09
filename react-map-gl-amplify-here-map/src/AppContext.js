// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { createContext } from "react";

const RoutingModesEnum = Object.freeze({
  CAR: "Car",
  WALKING: "Walking",
  TRUCK: "Truck",
});

const UnitsEnum = Object.freeze({
  METRIC: Object.freeze({
    distance: "Kilometers",
    dimensions: "Meters",
    weight: "Kilograms",
    label: "Metric (kg, m)",
    value: "metric",
  }),
  IMPERIAL: Object.freeze({
    distance: "Miles",
    dimensions: "Feet",
    weight: "Pounds",
    label: "Imperial (lb, ft)",
    value: "imperial",
  }),
});

const defaultState = {
  viewportCenter: [],
  markers: [],
  route: {},
  routingMode: RoutingModesEnum.CAR,
  truckOptions: {
    AvoidTolls: false,
    AvoidFerries: false,
    Dimensions: {},
    Weight: {},
  },
  carOptions: {
    AvoidTolls: false,
    AvoidFerries: false,
  },
  departureTime: null,
  units: UnitsEnum.METRIC.value,
  isRouting: false,
};

const AppContext = createContext(defaultState);

export { defaultState, AppContext, RoutingModesEnum, UnitsEnum };
