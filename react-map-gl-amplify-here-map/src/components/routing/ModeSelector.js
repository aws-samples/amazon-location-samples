// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from "react";
import { Hub } from "@aws-amplify/core";
import { Flex, View, Radio, RadioGroupField } from "@aws-amplify/ui-react";
import { RoutingModesEnum } from "../../AppContext";

const Mode = ({ value, isSelected, nth }) => {
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
      title={value}
    >
      <Radio className="custom-radio" value={value}>
        {value}
      </Radio>
    </View>
  );
};

// Component: ModeSelector - Routing Mode Selector (Radio buttons: Walking, Car, Truck)
const ModeSelector = () => {
  const [value, setValue] = useState(Object.values(RoutingModesEnum)[0]);

  const handleStateChange = (e) => {
    setValue(e.target.value);

    Hub.dispatch("Routing", {
      event: "changeRoutingMode",
      data: e.target.value,
    });
  };

  return (
    <Flex width="100%" justifyContent="center" alignItems="center" gap="0" margin="10px 0 0 0">
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
        {Object.values(RoutingModesEnum).map((routingMode, idx) => {
          let nth;
          // If first or last set props to round corners
          if (idx === 0) {
            nth = "first";
          } else if (idx === Object.values(RoutingModesEnum).length - 1) {
            nth = "last";
          }
          return (
            <Mode
              value={routingMode}
              isSelected={value === routingMode}
              key={routingMode}
              nth={nth}
            />
          );
        })}
      </RadioGroupField>
    </Flex>
  );
};

export default ModeSelector;
