// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import ModeSelector from "./ModeSelector";
import Options from "./Options";
import Summary from "./Summary";
import Inputs from "./Inputs";

// Component: RoutingMenu - Routing menu always displayed on map
function RoutingMenu() {
  const context = useContext(AppContext);
  const [hasSuggestions, setHasSuggestions] = useState(false);

  return (
    <div
      id="routing-menu"
      className="z-50 absolute right-3 bg-gray-100 w-96 p-3 rounded-md shadow-md"
    >
      {/* Inputs for the routing menu */}
      <Inputs setHasSuggestions={setHasSuggestions} />
      {/* Mode selector shown only when routing and there's a route available */}
      {hasSuggestions || !context.isRouting ? null : (
        <ModeSelector className="w-full my-2" />
      )}
      {/* If there's a route show its summary */}
      {hasSuggestions || !context.isRouting ? null : <Options />}
      {"Summary" in context.route && hasSuggestions === false ? (
        <Summary data={context.route.Summary} />
      ) : null}
    </div>
  );
}

export default RoutingMenu;
