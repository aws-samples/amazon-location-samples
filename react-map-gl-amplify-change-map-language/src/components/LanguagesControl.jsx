// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState, memo } from "react";
import { createPortal } from "react-dom";
import { useControl } from "react-map-gl";
import CustomControl from "./CustomControl";

// Component: LanguagesList - A list that allows to select a language for the map
const LanguagesList = memo(({ languagesList, setLanguage }) => {
  const renderOptions = (languagesList) => {
    const options = [];
    languagesList.forEach((value, key) => {
      options.push(
        <option key={value} value={value}>
          {key}
        </option>
      );
    });
    return options;
  };

  return (
    <div
      style={{
        zIndex: 50,
        top: "10px",
        left: "10px",
        pointerEvents: "all",
        position: "relative",
        backgroundColor: "white",
        borderRadius: "5px",
        margin: "0 0 5px 0",
        width: "15rem",
      }}
    >
      <select
        placeholder="Select a language"
        onChange={(e) => setLanguage(e.target.value)}
      >
        {renderOptions(languagesList)}
      </select>
    </div>
  );
});

const LanguagesControl = (props) => {
  const [, setVersion] = useState(0);

  const ctrl = useControl(
    () => {
      const forceUpdate = () => setVersion((v) => v + 1);
      return new CustomControl(forceUpdate, "languages-list");
    },
    { position: "top-left" }
  );

  if (!ctrl.getElement() || !ctrl.getMap()) {
    return null;
  } else {
    return createPortal(<LanguagesList {...props} />, ctrl.getElement());
  }
};

export default memo(LanguagesControl);
