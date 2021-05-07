// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

import "./App.css";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import LocationMap from "./LocationMap";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ alignSelf: "flex-end" }}>
          <AmplifySignOut />
        </div>
      </header>
      <LocationMap />
    </div>
  );
}

export default withAuthenticator(App);
