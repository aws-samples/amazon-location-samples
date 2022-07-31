// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from "react";
import { View } from "@aws-amplify/ui-react";
import DepartureTimeSelector from "./DepartureTimeSelector";
import ModeOptions from "./ModeOptions";

// Component: Options - Renders the options for the user to select
const Options = () => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);

  return (
    <View width="100%" margin="10px 0 5px 0">
      {isOptionOpen ? (
        <ModeOptions
          isOptionOpen={isOptionOpen}
          setIsOptionOpen={setIsOptionOpen}
        />
      ) : (
        <DepartureTimeSelector
          isOptionOpen={isOptionOpen}
          setIsOptionOpen={setIsOptionOpen}
        />
      )}
    </View>
  );
};

export default Options;
