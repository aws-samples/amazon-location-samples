// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useContext, useEffect, useState } from "react";
import { Hub } from "@aws-amplify/core";
import { Text, View, SliderField } from "@aws-amplify/ui-react";
import useDebounce from "../../hooks/useDebounce";
import { AppContext, UnitsEnum } from "../../AppContext";
import NumberField from "../primitives/NumberField";

// Component: TruckOptions - Renders the truck options form
function TruckOptions() {
  const context = useContext(AppContext);
  const [dimensions, setDimensions] = useState(context.truckOptions.Dimensions);
  const [weight, setWeight] = useState(context.truckOptions.Dimensions);
  // Debounce the options objects to avoid unnecessary updates
  const debouncedDimensions = useDebounce(dimensions, 500);
  const debouncedWeight = useDebounce(weight, 500);

  // Side effect that dispatches the updates to the global app state
  useEffect(() => {
    if (Object.keys(debouncedDimensions).length > 0) {
      console.debug(
        "Updating TruckOptions.Dimensions to ",
        debouncedDimensions
      );
      Hub.dispatch(
        "Routing",
        {
          event: "changeTruckOptions",
          data: debouncedDimensions,
        },
        "Dimensions"
      );
    }
  }, [debouncedDimensions]);

  // Side effect that dispatches the updates to the global app state
  useEffect(() => {
    if (Object.keys(debouncedWeight).length > 0) {
      console.debug("Updating TruckOptions.Weight to ", debouncedWeight);
      Hub.dispatch(
        "Routing",
        {
          event: "changeTruckOptions",
          data: debouncedWeight,
        },
        "Weight"
      );
    }
  }, [debouncedWeight]);

  // Handler function that updates the weight state
  const handleWeightChange = (key, value) => {
    console.debug(`${key} changed to ${value}`);
    const newWeight = { ...weight };
    newWeight[key] = value;
    setWeight(newWeight);
  };

  // Handler function that updates the dimensions state
  const handleDimensionChange = (key, value) => {
    console.debug(`${key} changed to ${value}`);
    const newDimensions = { ...dimensions };
    newDimensions[key] = value;
    setDimensions(newDimensions);
  };

  return (
    <>
      <Text fontSize="small">Truck Specs</Text>
      <View width="100%">
        <SliderField
          label={`Weight (${context.units === UnitsEnum.METRIC.value ? "kg" : "lbs"})`}
          fontSize="small"
          min={0}
          max={3500}
          value={Object.keys(weight).length > 0 ? weight.Total : 0}
          emptyTrackColor="var(--amplify-colors-background-secondary)"
          filledTrackColor="var(--amplify-colors-brand-primary)"
          step={0.5}
          onChange={(value) => handleWeightChange("Total", value)}
          className="weight-slider"
        />
      </View>
      <View width="100%">
        <NumberField
          label="Height"
          value={dimensions.Height || 0}
          minValue={0}
          maxValue={10}
          step={0.5}
          formatOptions={{
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
            style: "unit",
            unit: context.units === UnitsEnum.METRIC.value ? "meter" : "foot",
            unitDisplay: "short",
          }}
          onChange={(value) => handleDimensionChange("Height", value)}
        />
      </View>
      <View width="100%">
        <NumberField
          label="Length"
          value={dimensions.Length || 0}
          minValue={0}
          maxValue={30}
          step={0.5}
          formatOptions={{
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
            style: "unit",
            unit: context.units === UnitsEnum.METRIC.value ? "meter" : "foot",
            unitDisplay: "short",
          }}
          onChange={(value) => handleDimensionChange("Length", value)}
        />
      </View>
      <View width="100%">
        <NumberField
          label="Width"
          value={dimensions.Width || 0}
          minValue={0}
          maxValue={15}
          step={0.5}
          formatOptions={{
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
            style: "unit",
            unit: context.units === UnitsEnum.METRIC.value ? "meter" : "foot",
            unitDisplay: "short",
          }}
          onChange={(value) => handleDimensionChange("Width", value)}
        />
      </View>
    </>
  );
}

export default React.memo(TruckOptions);
