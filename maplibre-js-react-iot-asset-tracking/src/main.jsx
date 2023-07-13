import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Amplify } from "aws-amplify";
import config from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";
import "@aws-amplify/ui-react-geo/styles.css";
import "./index.css";

Amplify.configure(config);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
