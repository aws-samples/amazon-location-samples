// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useContext } from "react";
import { Hub } from "@aws-amplify/core";
import { Text, View, SwitchField } from "@aws-amplify/ui-react";
import { AppContext, RoutingModesEnum } from "../../AppContext";

// Component: AvoidanceOptions - Renders the options for the avoidance routing mode
const AvoidanceOptions = () => {
  const context = useContext(AppContext);
  const defaultChecked = {};

  // Set defaults based on the current routing mode
  if (context.routingMode === RoutingModesEnum.CAR) {
    defaultChecked.AvoidFerries = context.carOptions.AvoidFerries;
    defaultChecked.AvoidTolls = context.carOptions.AvoidTolls;
  } else if (context.routingMode === RoutingModesEnum.TRUCK) {
    defaultChecked.AvoidFerries = context.truckOptions.AvoidFerries;
    defaultChecked.AvoidTolls = context.truckOptions.AvoidTolls;
  }

  // Handler for the avoidances changes
  const handleAvoidanceChanges = (id, value) => {
    console.debug(`${id} changed to`, value);
    Hub.dispatch(
      "Routing",
      {
        event: "changeAvoidances",
        data: {
          key: id,
          value: value,
        },
      },
      context.routingMode
    );
  };

  return (
    <>
      <Text fontSize="small">Avoid</Text>
      <View key={`${context.routingMode}AvoidFerries`}>
        <SwitchField
          isDisabled={false}
          label="Ferries"
          isLabelHidden={false}
          labelPosition="end"
          trackColor="var(--amplify-colors-background-secondary)"
          trackCheckedColor="var(--amplify-colors-brand-primary)"
          onChange={(e) =>
            handleAvoidanceChanges("AvoidFerries", e.target.checked)
          }
          defaultChecked={defaultChecked.AvoidFerries}
        />
      </View>
      <View
        key={`${context.routingMode}AvoidTolls`}
        title="Avoid tolls when calculating routes"
      >
        <SwitchField
          isDisabled={false}
          label="Tolls"
          isLabelHidden={false}
          labelPosition="end"
          trackColor="var(--amplify-colors-background-secondary)"
          trackCheckedColor="var(--amplify-colors-brand-primary)"
          onChange={(e) =>
            handleAvoidanceChanges("AvoidTolls", e.target.checked)
          }
          defaultChecked={defaultChecked.AvoidTolls}
        />
      </View>
    </>
  );
};

export default AvoidanceOptions;
