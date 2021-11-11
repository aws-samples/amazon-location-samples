// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useRef } from "react";
import { useButton } from "@react-aria/button";

const Button = (props) => {
  let ref = useRef();
  const { className, title } = props;
  let { buttonProps } = useButton(props, ref);
  let { children } = props;

  return (
    <button className={className} title={title} {...buttonProps} ref={ref}>
      {children}
    </button>
  );
};

export default Button;
