// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useContext } from "react";
import { AppContext, RoutingModesEnum } from "../../AppContext";
import TruckOptions from "./TruckOptions";
import Button from "../primitives/Button";
import AvoidanceOptions from "./AvoidanceOptions";
import MeasurementsOptions from "./MeasurementsOptions";

// Component: ModeOptions - Renders the options for each routing mode
const ModeOptions = ({ isOptionOpen, setIsOptionOpen }) => {
  const context = useContext(AppContext);
  const defaultChecked = {};
  // Set default values based on the current routing mode
  if (context.routingMode === RoutingModesEnum.CAR) {
    defaultChecked.AvoidFerries = context.carOptions.AvoidFerries;
    defaultChecked.AvoidTolls = context.carOptions.AvoidTolls;
  } else if (context.routingMode === RoutingModesEnum.TRUCK) {
    defaultChecked.AvoidFerries = context.truckOptions.AvoidFerries;
    defaultChecked.AvoidTolls = context.truckOptions.AvoidTolls;
  }

  return (
    <div className="w-full">
      <div className="w-full flex">
        <div className="w-3/4">
          <p className="text-sm">Routing Options</p>
        </div>
        <Button
          className="w-1/4 text-center text-sm uppercase"
          onPress={() => setIsOptionOpen(!isOptionOpen)}
        >
          {isOptionOpen ? "Close" : "Options"}
        </Button>
      </div>
      <div className="w-full flex flex-wrap py-2">
        {context.routingMode === RoutingModesEnum.WALKING ? null : (
          <div className="w-1/2">
            <AvoidanceOptions key={`${context.routingMode}-AvoidanceOptions`} />
          </div>
        )}
        {context.routingMode !== RoutingModesEnum.TRUCK ? null : (
          <div className="w-1/2">
            <TruckOptions key={`${context.routingMode}-TruckOptions`} />
          </div>
        )}
        <div className="w-full mt-2">
          <MeasurementsOptions />
        </div>
      </div>
    </div>
  );
};

export default ModeOptions;
