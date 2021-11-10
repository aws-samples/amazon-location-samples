// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useRef } from "react";
import { useNumberFieldState } from "@react-stately/numberfield";
import { useLocale } from "@react-aria/i18n";
import { useButton } from "@react-aria/button";
import { useNumberField } from "@react-aria/numberfield";

// Currently seeing a bug that doesn't prevent usage but
// generates an error in the console https://github.com/adobe/react-spectrum/issues/2418
const NumberField = (props) => {
  let { locale } = useLocale();
  let state = useNumberFieldState({ ...props, locale });
  let inputRef = useRef();
  let incrRef = useRef();
  let decRef = useRef();
  let {
    labelProps,
    groupProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps,
  } = useNumberField(props, state, inputRef);

  let { buttonProps: incrementProps } = useButton(
    incrementButtonProps,
    incrRef
  );
  let { buttonProps: decrementProps } = useButton(decrementButtonProps, decRef);

  return (
    <>
      <label {...labelProps} className="w-full text-sm">
        {props.label}
      </label>
      <div {...groupProps} className="w-full max-w-xs flex">
        <button
          className="w-1/5 text-sm text-white bg-gray-500 rounded-tl-md rounded-bl-md border border-gray-500"
          title={`Decrease truck ${props.label.toLowerCase()}`}
          {...decrementProps}
          ref={incrRef}
        >
          -
        </button>
        <input className="w-2/5 text-center" {...inputProps} ref={inputRef} />
        <button
          className="w-1/5 text-sm text-white bg-gray-500 rounded-tr-md rounded-br-md border border-gray-500"
          title={`Increase truck ${props.label.toLowerCase()}`}
          {...incrementProps}
          ref={decRef}
        >
          +
        </button>
      </div>
    </>
  );
};

export default NumberField;
