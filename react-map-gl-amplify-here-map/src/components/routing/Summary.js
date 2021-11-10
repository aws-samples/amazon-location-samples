// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useContext } from "react";
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
    <div className="py-1">
      <p className="text-md font-semibold">Your Itinerary:</p>
      <div className="flex py-1">
        <p className="text-md w-1/2">
          {action} for {formatTime(duration)}
        </p>
        <p className="text-sm w-1/2 text-gray-500 flex items-end justify-end">
          {formattedDistance} {formattedUnit}
        </p>
      </div>
    </div>
  );
};

export default Summary;
