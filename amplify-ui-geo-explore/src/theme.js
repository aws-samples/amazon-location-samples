// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export const theme = {
  name: "amazon-location-service",
  tokens: {
    components: {
      button: {
        backgroundColor: { value: "{colors.white.value}" },
        _focus: {
          boxShadow: { value: "none" },
          borderColor: { value: "{components.fieldcontrol.borderColor.value}" },
          backgroundColor: { value: "white" },
        },
        _hover: {
          backgroundColor: { value: "{colors.white.value}" },
        },
        primary: {
          _focus: {
            boxShadow: { value: "none" },
            backgroundColor: { value: "{colors.brand.primary.80.value}" },
          },
        },
      },
    },
  },
};
