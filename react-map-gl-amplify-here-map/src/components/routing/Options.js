// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from "react";
import DepartureTimeSelector from "./DepartureTimeSelector";
import ModeOptions from "./ModeOptions";

// Component: Options - Renders the options for the user to select
const Options = () => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);

  // TODO: complete this function for time
  return (
    // <div className="w-full border border-red-400">
    <div className="w-full">
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
    </div>
  );
};

export default Options;
