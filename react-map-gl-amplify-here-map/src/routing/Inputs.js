// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useContext, useEffect, useState, useRef } from "react";
import { Hub } from "@aws-amplify/core";
import { AppContext } from "../AppContext";
import useDebounce from "../useDebounce";
import { Geo } from "@aws-amplify/geo";
import Button from "../primitives/Button";
import NavigationIcon from "../primitives/NavigateIcon";

// Helper function to format address
const formatAddress = ({ street, addressNumber, postalCode, municipality }) => {
  const address = [];
  if (street !== undefined) address.push(street);
  if (addressNumber !== undefined) address.push(addressNumber);
  if (postalCode !== undefined) address.push(postalCode);
  if (municipality !== undefined) address.push(municipality);

  return address.join(", ");
};

// Component: RoutingMenuInput - Input for routing with debounced state and events
const RoutingMenuInput = ({
  marker,
  idx,
  handleValueChangeRef,
  handleExitInputBubble,
}) => {
  const defaultValue = formatAddress(marker);
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value, 1000);

  useEffect(() => {
    if (debouncedValue !== defaultValue && handleValueChangeRef.current) {
      console.debug(debouncedValue);
      handleValueChangeRef.current(debouncedValue.trim(), idx);
    }
  }, [debouncedValue, defaultValue, handleValueChangeRef, idx]);

  const handleExitInput = (e) => {
    const { key } = e;
    if (key !== "Escape") {
      return;
    }
    setValue(defaultValue);
    handleExitInputBubble();
  };

  return (
    <input
      className="w-full p-1 mb-1 border border-gray-500 rounded-md"
      placeholder="Start typing, or click on the map"
      onChange={(e) => setValue(e.target.value)}
      onKeyUp={handleExitInput}
      value={value}
    />
  );
};

// Component: Inputs - Routing inputs
const Inputs = ({ setHasSuggestions }) => {
  const context = useContext(AppContext);
  const inputs = [...context.markers];
  const [suggestions, setSuggestions] = useState([]);
  const [focusedInputIdx, setFocusedInputIdx] = useState(-1);
  // const [isDirty, setDirty] = useState(false);
  const isDirtyRef = useRef(false);

  // Geocode value (address) to retrieve suggestions
  const searchByText = async (value) => {
    if (value.trim() === "") {
      return;
    }
    try {
      const res = await Geo.searchByText(value, {
        biasPosition: context.viewportCenter,
      });
      console.debug(res);
      if (res.length > 0) {
        setSuggestions(res);
      } else {
        setSuggestions(["No result found for this address."]);
      }
      setHasSuggestions(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Handler to updates of the input
  const handleValueChange = (value, idx) => {
    console.debug("Searching position by value", value);
    searchByText(value);
    setFocusedInputIdx(idx);
    if (isDirtyRef.current === false) {
      isDirtyRef.current = true;
    }
  };
  // Ref for the handler so it persists between renders
  const handleValueChangeRef = useRef(handleValueChange);

  // Handler to suggestion selection
  const handleResultClick = (result) => {
    console.debug("Result chosen", formatAddress(result));
    console.debug("Should update input w index", focusedInputIdx);
    setSuggestions([]);
    setHasSuggestions(false);
    Hub.dispatch(
      "Markers",
      {
        event: "setMarkerNoGeocode",
        data: { idx: focusedInputIdx, marker: result },
      },
      "routingMenu"
    );
  };

  // Inputs are mapped to the markers, if there's no marker show at least one input
  if (inputs[0] === undefined && !context.isRouting) inputs[0] = {};

  return (
    <>
      {inputs.map((marker, idx) => (
        <div key={JSON.stringify(marker?.geometry) + isDirtyRef.current || 0}>
          <RoutingMenuInput
            marker={isDirtyRef.current || context.isRouting ? marker : {}}
            idx={idx}
            handleValueChangeRef={handleValueChangeRef}
            handleExitInputBubble={() => {
              setSuggestions([]);
              setHasSuggestions(false);
            }}
          />
        </div>
      ))}
      {inputs.length === 1 &&
      Object.keys(inputs[0]).length > 0 &&
      suggestions.length === 0 &&
      !context.isRouting &&
      isDirtyRef.current ? (
        <div className="flex justify-center">
          <Button
            title="Start Routing"
            className="p-1 flex items-center cursor-pointer border border-yellow-500 bg-yellow-500 rounded-md hover:bg-yellow-600 drop-shadow-md filter"
            onPress={() => Hub.dispatch("Routing", { event: "startRouting" })}
          >
            <span className="text-white">Directions</span>
            <NavigationIcon width="24" height="24" className="text-white" />
          </Button>
        </div>
      ) : null}
      {suggestions.length === 0
        ? null
        : suggestions.map((result, idx) => (
            <div
              key={idx}
              className="cursor-pointer"
              onClick={() => handleResultClick(result)}
            >
              <span>{formatAddress(result)}</span>
            </div>
          ))}
    </>
  );
};

export default Inputs;
