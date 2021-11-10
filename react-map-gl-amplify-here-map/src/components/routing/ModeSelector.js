// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useContext, useEffect, createContext, useRef } from "react";
import { Hub } from "@aws-amplify/core";
import { useRadioGroupState } from "@react-stately/radio";
import { useRadio, useRadioGroup } from "@react-aria/radio";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useFocusRing } from "@react-aria/focus";
import { AppContext, RoutingModesEnum, defaultState } from "../../AppContext";

let ModeContext = createContext(null);

// Component: Mode - Routing Mode Button
function Mode(props) {
  let { children, value } = props;
  let state = useContext(ModeContext);
  let ref = useRef(null);
  let { inputProps } = useRadio(props, state, ref);
  let { isFocusVisible, focusProps } = useFocusRing();

  let isSelected = state.selectedValue === props.value;
  let backgroundColor = isSelected ? "bg-yellow-500" : "bg-gray-500";
  let borderColor = isFocusVisible ? "border-yellow-500" : "border-gray-500";
  let borderRadius = "";
  if (props.nth === "first") borderRadius = "rounded-tl-md rounded-bl-md";
  if (props.nth === "last") borderRadius = "rounded-tr-md rounded-br-md";

  return (
    <label
      className={`w-1/3 text-white text-center border cursor-pointer ${backgroundColor} ${borderColor} ${borderRadius}`}
      title={value}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      {children}
    </label>
  );
}

// Component: ModeSelector - Routing Mode Selector (Radio buttons: Walking, Car, Truck)
const ModeSelector = ({ className }) => {
  const context = useContext(AppContext);
  let state = useRadioGroupState({});
  let { radioGroupProps, labelProps } = useRadioGroup({}, state);

  // Side effect that runs when routing mode changes
  useEffect(() => {
    if (state.selectedValue === undefined) {
      state.setSelectedValue(defaultState.routingMode);
    } else if (state.selectedValue !== undefined) {
      Hub.dispatch("Routing", {
        event: "changeRoutingMode",
        data: state.selectedValue,
      });
    }
  }, [state, context.routingMode]);

  return (
    <div {...radioGroupProps} className={`flex ${className}`}>
      <VisuallyHidden>
        <span {...labelProps}>Routing Mode</span>
      </VisuallyHidden>
      <ModeContext.Provider value={state}>
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
              key={routingMode}
              value={routingMode}
              title={routingMode}
              nth={nth}
            >
              {routingMode}
            </Mode>
          );
        })}
      </ModeContext.Provider>
    </div>
  );
};

export default ModeSelector;
