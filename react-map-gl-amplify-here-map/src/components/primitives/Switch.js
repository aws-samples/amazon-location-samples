// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useRef, useEffect } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useToggleState } from "@react-stately/toggle";
import { useFocusRing } from "@react-aria/focus";
import { useSwitch } from "@react-aria/switch";

const Switch = (props) => {
  const { defaultChecked, onChange } = props;
  let state = useToggleState(props);
  let ref = useRef();
  let { inputProps } = useSwitch(props, state, ref);
  let { isFocusVisible, focusProps } = useFocusRing();
  useEffect(() => {
    if (state.isSelected !== defaultChecked) {
      state.setSelected(defaultChecked);
    }
  }, [state, defaultChecked, onChange]);

  return (
    <label
      className="flex items-center text-sm cursor-pointer"
      title={state.isSelected ? props.enabledTitle : props.disabledTitle}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <svg width={40} height={24} aria-hidden="true" style={{ marginRight: 4 }}>
        <rect
          x={4}
          y={4}
          rx={8}
          className={`w-8 h-4 fill-current text-${state.isSelected ? "yellow" : "gray"}-500`}
        />
        <circle cx={state.isSelected ? 28 : 12} cy={12} r={5} fill="white" />
        {isFocusVisible && (
          <rect
            x={1}
            y={1}
            width={38}
            height={22}
            rx={11}
            fill="none"
            className="stroke-current stroke-2 text-yellow-500"
          />
        )}
      </svg>
      {props.children}
    </label>
  );
};

export default Switch;
