// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useContext } from "react";
import { Button, View, Flex, Text } from "@aws-amplify/ui-react";
import { AppContext, RoutingModesEnum } from "../../AppContext";
import TruckOptions from "./TruckOptions";
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
    <View width="100%">
      <Flex width="100%">
        <Flex width="75%" justifyContent="flex-start" alignItems="center">
          <Text fontSize="small">Routing Options</Text>
        </Flex>
        <Button
          size="small"
          border="0"
          backgroundColor="transparent"
          onClick={() => setIsOptionOpen(!isOptionOpen)}
        >
          <Text
            textTransform="uppercase"
            fontWeight="lighter"
          >
            {isOptionOpen ? "Close" : "Options"}
          </Text>
        </Button>
      </Flex>
      <Flex width="100%" wrap="wrap" padding="5px 0">
        {context.routingMode === RoutingModesEnum.WALKING ? null : (
          <View width="45%">
            <AvoidanceOptions key={`${context.routingMode}-AvoidanceOptions`} />
          </View>
        )}
        {context.routingMode !== RoutingModesEnum.TRUCK ? null : (
          <View width="45%">
            <TruckOptions key={`${context.routingMode}-TruckOptions`} />
          </View>
        )}
        <View width="100%">
          <MeasurementsOptions />
        </View>
      </Flex>
    </View>
  );
};

export default ModeOptions;
