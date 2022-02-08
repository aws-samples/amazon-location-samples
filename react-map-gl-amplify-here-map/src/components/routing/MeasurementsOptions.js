// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from "react";
import { Hub } from "@aws-amplify/core";
import { Flex, View, Radio, RadioGroupField, Text } from "@aws-amplify/ui-react";
import { UnitsEnum } from "../../AppContext";


// Component: Unit - Renders a single unit option
function Unit({ label, value, isSelected, nth }) {
  let borderRadius = "";
  if (nth === "first") borderRadius = "var(--amplify-radii-small) 0 0 var(--amplify-radii-small)";
  if (nth === "last") borderRadius = "0 var(--amplify-radii-small) var(--amplify-radii-small) 0";

  return (
    <View
      width="calc(100% / 3)"
      backgroundColor={isSelected ? "var(--amplify-colors-brand-primary)" : "var(--amplify-colors-background-secondary)"}
      style={{
        cursor: "pointer",
        borderRadius: borderRadius,
        border: "1px solid",
        borderColor: "var(--amplify-colors-background-secondary)"
      }}
      padding="var(--amplify-space-xxxs) 0"
      title={label}
    >
      <Radio className="custom-radio" value={value}>
        {label}
      </Radio>
    </View>
  );
}

// Component: MeasurementsOptions - Renders the measurement options
const MeasurementsOptions = () => {
  const [value, setValue] = useState(Object.values(UnitsEnum)[0].value);

  const handleStateChange = (e) => {
    setValue(e.target.value);

    Hub.dispatch("Routing", {
      event: "changeUnits",
      data: e.target.value,
    });
  };

  return (
    <>
      <Text fontSize="small">Measurements Options</Text>
      <Flex width="100%" justifyContent="center" alignItems="center" gap="0">
        <RadioGroupField
          label="Routing Mode"
          labelHidden={true}
          direction="row"
          value={value}
          onChange={handleStateChange}
          width="100%"
          display="flex"
          alignContent="center"
          className="routing-mode-selector"
        >
          {/* Show routing mode buttons */}
          {Object.values(UnitsEnum).map((unit, idx) => {
            let nth;
            // If first or last set props to round corners
            if (idx === 0) {
              nth = "first";
            } else if (idx === Object.values(UnitsEnum).length - 1) {
              nth = "last";
            }
            return (
              <Unit
                value={unit.value}
                label={unit.label}
                isSelected={value === unit.value}
                key={unit.value}
                nth={nth}
              />
            );
          })}
        </RadioGroupField>
      </Flex>
    </>
  );
};

export default MeasurementsOptions;
