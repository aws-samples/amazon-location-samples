// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useControl } from "react-map-gl";
import { Hub } from "@aws-amplify/core";
import CustomControl from "./CustomControl";
import { Flex, View, Text } from "@aws-amplify/ui-react";
import { AppContext } from "../../AppContext";
import Button from "../primitives/Button";
import NavigationIcon from "../primitives/NavigateIcon";

// Component: MarkerToast - A toast that appears when a marker is created and we are not routing
function MarkerToast() {
  const context = useContext(AppContext);

  // If we are routing or there's no marker, don't show the toast
  if (context.isRouting || context.markers.length < 1) {
    return null;
  }

  // Find the marker that is not a placeholder
  const marker = context.markers.find(
    (el) => el !== undefined && Object.keys(el).length > 0
  );

  // If the marker is a placeholder, or the marker comes from the routing menu, then don't show the toast
  if (Object.keys(marker).length === 1 || marker?.source !== "map") {
    return null;
  }

  return (
    <Flex
      style={{
        zIndex: 50,
        right: "calc(50vw - calc(20rem / 2))",
        pointerEvents: "all"
      }}
      position="relative"
      height="4rem"
      justifyContent="center"
    >
      <View
        width="20rem"
        height="100%"
        backgroundColor="var(--amplify-colors-neutral-10)"
        borderRadius="var(--amplify-radii-medium)"
        boxShadow="var(--amplify-shadows-medium)"
        padding="var(--amplify-space-xs)"
      >
        <Flex height="100%">
          {/* Place Info */}
          <View width="70%">
            <Text textAlign="left" fontSize="small" fontWeight="bold" lineHeight="normal">
              {marker.street}
              {marker.addressNumber && `, ${marker.addressNumber}`}
            </Text>
            <Text textAlign="left" fontSize="small" fontWeight="bold" lineHeight="normal">
              {marker.postalCode}
              {marker.municipality && ` ${marker.municipality}`}
              {marker.country && ", "}
              {marker.country}
            </Text>
            <Text textAlign="left" color="var(--amplify-colors-font-tertiary)" fontSize="small" lineHeight="normal">
              {marker.geometry.point[1]}, {marker.geometry.point[0]}
            </Text>
          </View>
          {/* Routing button */}
          <Flex width="15%" height="100%" justifyContent="center" alignItems="center">
            <Button
              title="Start Routing"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "rotate(45deg)",
                cursor: "pointer",
                height: "2rem",
                width: "2rem",
                boxShadow: "var(--amplify-shadows-medium)",
                backgroundColor: "var(--amplify-colors-brand-primary)",
                border: "1px solid var(--amplify-colors-brand-primary)"
              }}
              onPress={() => Hub.dispatch("Routing", { event: "startRouting" })}
            >
              <NavigationIcon
                width="24"
                height="24"
                style={{
                  transform: "rotate(-45deg)",
                  fill: "white"
                }}
              />
            </Button>
          </Flex>
          {/* Close toast button */}
          <Flex width="15%" justifyContent="flex-end" alignItems="flex-start">
            <Button
              title="Close"
              style={{
                cursor: "pointer",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "var(--amplify-font-size-small)",
              }}
              onPress={() => Hub.dispatch("Markers", { event: "closeToast" })}
            >
              ✖️
            </Button>
          </Flex>
        </Flex>
      </View>
    </Flex>
  );
}

const MarkerControl = () => {
  const [, setVersion] = useState(0);

  const ctrl = useControl(() => {
    const forceUpdate = () => setVersion((v) => v + 1);
    return new CustomControl(forceUpdate, "marker-toast");
  }, { position: "bottom-right" });

  if (!ctrl.getElement() || !ctrl.getMap()) {
    return null;
  } else {
    return createPortal(<MarkerToast />, ctrl.getElement());
  }
};

export default React.memo(MarkerControl);
