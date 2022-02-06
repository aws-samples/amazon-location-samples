// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useRef } from "react";
import { useSliderState } from "@react-stately/slider";
import { useFocusRing } from "@react-aria/focus";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { mergeProps } from "@react-aria/utils";
import { useNumberFormatter } from "@react-aria/i18n";
import { useSlider, useSliderThumb } from "@react-aria/slider";

const Thumb = (props) => {
  let { state, trackRef, index } = props;
  let inputRef = useRef(null);
  let { thumbProps, inputProps } = useSliderThumb(
    {
      index,
      trackRef,
      inputRef,
    },
    state
  );

  let { focusProps, isFocusVisible } = useFocusRing();
  return (
    <div
      style={{
        position: "absolute",
        top: 4,
        transform: "translateX(-50%)",
        left: `${state.getThumbPercent(index) * 100}%`,
      }}
    >
      <div
        {...thumbProps}
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: isFocusVisible
            ? "orange"
            : state.isThumbDragging(index)
              ? "dimgrey"
              : "gray",
        }}
      >
        <VisuallyHidden>
          <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
        </VisuallyHidden>
      </div>
    </div>
  );
};

const Slider = (props) => {
  let trackRef = useRef(null);
  let numberFormatter = useNumberFormatter(props.formatOptions);
  let state = useSliderState({ ...props, numberFormatter });
  let { groupProps, trackProps, labelProps, outputProps } = useSlider(
    props,
    state,
    trackRef
  );

  return (
    <div
      {...groupProps}
      className="flex relative flex-col items-center justify-center cursor-pointer w-3/4"
      style={{
        touchAction: "none",
      }}
    >
      {/* Create a flex container for the label and output element. */}
      <div className="flex self-stretch text-sm">
        {props.label && <label {...labelProps}>{props.label}</label>}
        <output
          {...outputProps}
          className="flex flex-grow flex-shrink-0 justify-end"
        >
          {state.getThumbValueLabel(0)}
        </output>
      </div>
      {/* The track element holds the visible track line and the thumb. */}
      <div
        {...trackProps}
        ref={trackRef}
        className="relative w-full h-8 left-2"
      >
        <div className="absolute bg-gray-500 h-1 top-3 w-full" />
        <Thumb index={0} state={state} trackRef={trackRef} />
      </div>
    </div>
  );
};

export default Slider;
