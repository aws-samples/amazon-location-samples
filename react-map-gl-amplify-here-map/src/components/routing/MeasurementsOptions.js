// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useContext, useEffect, createContext, useRef } from "react";
import { Hub } from "@aws-amplify/core";
import { useRadioGroupState } from "@react-stately/radio";
import { useRadio, useRadioGroup } from "@react-aria/radio";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useFocusRing } from "@react-aria/focus";
import { AppContext, defaultState, UnitsEnum } from "../../AppContext";

let MeasurementsContext = createContext(null);

// Component: Unit - Renders a single unit option
function Unit(props) {
  let { children, value } = props;
  let state = useContext(MeasurementsContext);
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
      className={`w-1/2 text-white text-center border cursor-pointer text-sm ${backgroundColor} ${borderColor} ${borderRadius}`}
      title={value}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      {children}
    </label>
  );
}

// Component: MeasurementsOptions - Renders the measurement options
const MeasurementsOptions = () => {
  const context = useContext(AppContext);
  let state = useRadioGroupState({});
  let { radioGroupProps, labelProps } = useRadioGroup({}, state);

  // Side effect that runs when the selected unit value changes
  useEffect(() => {
    if (state.selectedValue === undefined) {
      state.setSelectedValue(defaultState.units);
    } else if (state.selectedValue !== undefined) {
      Hub.dispatch("Routing", {
        event: "changeUnits",
        data: state.selectedValue,
      });
    }
  }, [state, context.routingMode]);

  return (
    <div {...radioGroupProps}>
      <p {...labelProps} className="text-sm">
        Measurement System
      </p>
      <div className="flex w-2/3">
        <MeasurementsContext.Provider value={state}>
          {Object.values(UnitsEnum).map((unit, idx) => {
            let nth;
            if (idx === 0) {
              nth = "first";
            } else if (idx === Object.values(UnitsEnum).length - 1) {
              nth = "last";
            }
            return (
              <Unit
                key={unit.value}
                value={unit.value}
                title={unit.label}
                nth={nth}
              >
                {unit.label}
              </Unit>
            );
          })}
        </MeasurementsContext.Provider>
      </div>
    </div>
  );
};

export default MeasurementsOptions;
