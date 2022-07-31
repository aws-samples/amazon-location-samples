// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AmplifyProvider } from "@aws-amplify/ui-react";
import "normalize.css";
import "@aws-amplify/ui-react/styles.css";
import "./index.css";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const theme = {
  name: "my-theme",
  tokens: {
    colors: {
      brand: {
        primary: { value: "#FF9900" },
      },
      background: {
        secondary: { value: "rgba(107, 114, 128, 1)" },
      },
    },
  },
};

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AmplifyProvider theme={theme}>
      <App />
    </AmplifyProvider>
  </React.StrictMode>
);
