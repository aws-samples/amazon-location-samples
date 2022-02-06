// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useContext, useEffect, useState } from "react";
import { Hub } from "@aws-amplify/core";
import useDebounce from "../../hooks/useDebounce";
import { AppContext, UnitsEnum } from "../../AppContext";
import NumberField from "../primitives/NumberField";
import Slider from "../primitives/Slider";

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
    newWeight[key] = value[0];
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
      <p className="text-sm">Truck Specs</p>
      <div>
        <Slider
          label="Weight"
          formatOptions={{
            style: "unit",
            unit:
              context.units === UnitsEnum.METRIC.value ? "kilogram" : "pound",
            unitDisplay: "short",
          }}
          minValue={0}
          maxValue={3500}
          step={0.5}
          onChange={(value) => handleWeightChange("Total", value)}
        />
      </div>
      <div className="w-full">
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
      </div>
      <div className="w-full">
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
      </div>
      <div className="w-full">
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
      </div>
    </>
  );
}

export default TruckOptions;
