// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useContext } from "react";
import { Hub } from "@aws-amplify/core";
import { AppContext, RoutingModesEnum } from "../../AppContext";
import Switch from "../primitives/Switch";

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
      <p className="text-sm">Avoid</p>
      <div key={`${context.routingMode}AvoidFerries`}>
        <Switch
          defaultChecked={defaultChecked.AvoidFerries}
          onChange={(checked) =>
            handleAvoidanceChanges("AvoidFerries", checked)
          }
          enabledTitle="Avoid ferries when calculating routes"
          disabledTitle="Don't avoid ferries when calculating routes"
        >
          Ferries
        </Switch>
      </div>
      <div
        key={`${context.routingMode}AvoidTolls`}
        title="Avoid tolls when calculating routes"
      >
        <Switch
          defaultChecked={defaultChecked.AvoidTolls}
          onChange={(checked) => handleAvoidanceChanges("AvoidTolls", checked)}
          enabledTitle="Avoid tolls when calculating routes"
          disabledTitle="Don't avoid tolls when calculating routes"
        >
          Tolls
        </Switch>
      </div>
    </>
  );
};

export default AvoidanceOptions;
