// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useControl } from "react-map-gl";
import { View } from "@aws-amplify/ui-react";
import { AppContext } from "../../AppContext";
import ModeSelector from "../routing/ModeSelector";
import Options from "../routing/Options";
import Summary from "../routing/Summary";
import Inputs from "../routing/Inputs";
import CustomControl from "./CustomControl";

// Component: RoutingMenu - Routing menu always displayed on map
function RoutingMenu() {
  const context = useContext(AppContext);
  const [hasSuggestions, setHasSuggestions] = useState(false);

  return (
    <View
      style={{
        zIndex: 50,
        pointerEvents: "all",
        top: 10,
        right: 10
      }}
      backgroundColor="var(--amplify-colors-neutral-20)"
      borderRadius="var(--amplify-radii-medium)"
      boxShadow="var(--amplify-shadows-medium)"
      padding="var(--amplify-space-xs)"
      width="24rem"
      position="relative"
    >
      {/* Inputs for the routing menu */}
      <Inputs setHasSuggestions={setHasSuggestions} />
      {/* Mode selector shown only when routing and there's a route available */}
      {hasSuggestions || !context.isRouting ? null : (
        <ModeSelector />
      )}
      {/* If there's a route show its summary */}
      {hasSuggestions || !context.isRouting ? null : <Options />}
      {"Summary" in context.route && hasSuggestions === false ? (
        <Summary data={context.route.Summary} />
      ) : null}
    </View>
  );
}

const MarkerControl = () => {
  const [, setVersion] = useState(0);

  const ctrl = useControl(() => {
    const forceUpdate = () => setVersion((v) => v + 1);
    return new CustomControl(forceUpdate, "routing-menu");
  }, { position: "top-right" });

  if (!ctrl.getElement() || !ctrl.getMap()) {
    return null;
  } else {
    return createPortal(<RoutingMenu />, ctrl.getElement());
  }
};

export default React.memo(MarkerControl);
