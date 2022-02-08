// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useRef } from "react";
import { Text, Flex, Button } from "@aws-amplify/ui-react";
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
      <Text {...labelProps} width="100%" size="small">
        {props.label}
      </Text>
      <Flex {...groupProps} width="100%" gap="0" justifyContent="flex-start">
        <Button
          size="small"
          backgroundColor="var(--amplify-colors-background-secondary)"
          color="white"
          borderRadius="var(--amplify-radii-small) 0 0 var(--amplify-radii-small)"
          border="1px solid var(--amplify-colors-background-secondary)"
          title={`Decrease truck ${props.label.toLowerCase()}`}
          {...decrementProps}
          ref={incrRef}
        >
          -
        </Button>
        <input style={{
          width: "40%",
        }} {...inputProps} ref={inputRef} />
        <Button
          size="small"
          backgroundColor="var(--amplify-colors-background-secondary)"
          color="white"
          borderRadius="0 var(--amplify-radii-small) var(--amplify-radii-small) 0"
          border="1px solid var(--amplify-colors-background-secondary)"
          title={`Increase truck ${props.label.toLowerCase()}`}
          {...incrementProps}
          ref={decRef}
        >
          +
        </Button>
      </Flex>
    </>
  );
};

export default NumberField;
