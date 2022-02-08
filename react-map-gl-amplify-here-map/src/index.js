// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AmplifyProvider } from "@aws-amplify/ui-react";
import "normalize.css";
import "@aws-amplify/ui-react/styles.css";
import "./index.css";
import Amplify from "aws-amplify";
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
      }
    },
  },
};

ReactDOM.render(
  <React.StrictMode>
    <AmplifyProvider theme={theme}>
      <App />
    </AmplifyProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
