// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useContext } from "react";
import { View, Flex, Text } from "@aws-amplify/ui-react";
import { AppContext, RoutingModesEnum } from "../../AppContext";

// Helper function to format time
const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  const sec = Math.floor(seconds % 60);

  const roundedMin = sec > 30 ? min + 1 : min;

  return `${hrs > 0 ? hrs + " hr " : ""}${roundedMin} min`;
};

// Helper function to format distance
const formatDistance = (distance, unit) => {
  const system = unit === "Kilometers" ? "metric" : "imperial";

  let formattedDistance = distance;
  let formattedUnit;
  if (distance < 1) {
    formattedDistance = distance * 1000;
    formattedUnit = system === "metric" ? "m" : "ft";
  } else {
    formattedUnit = system === "metric" ? "km" : "mi";
  }
  formattedDistance =
    Math.round((formattedDistance + Number.EPSILON) * 100) / 100;

  return [formattedDistance, formattedUnit];
};

// Component: Summary - displays summary of route
const Summary = ({ data }) => {
  const context = useContext(AppContext);

  const {
    Distance: distance,
    DistanceUnit: unit,
    DurationSeconds: duration,
  } = data;

  const [formattedDistance, formattedUnit] = formatDistance(distance, unit);
  const action =
    context.routingMode === RoutingModesEnum.WALKING ? "Walk" : "Drive";

  return (
    <View padding="5px 0">
      <Text fontWeight="bold" fontSize="medium">Your Itinerary:</Text>
      <Flex padding="5px 0">
        <Text fontSize="medium" width="50%" className="text-md w-1/2">
          {action} for {formatTime(duration)}
        </Text>
        <Flex width="50%" alignItems="end" justifyContent="flex-end">
          <Text fontSize="small" color="var(--amplify-colors-font-tertiary)">{formattedDistance} {formattedUnit}</Text>
        </Flex>
      </Flex>
    </View>
  );
};

export default Summary;
