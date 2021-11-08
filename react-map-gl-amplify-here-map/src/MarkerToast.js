import { useContext } from "react";
import { Hub } from "@aws-amplify/core";
import { AppContext } from "./AppContext";
import Button from "./primitives/Button";
import NavigationIcon from "./primitives/NavigateIcon";

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
    <div
      className="z-50 w-80 h-18 absolute bottom-2 flex justify-center"
      id="marker-toast"
    >
      <div className=" w-80 bg-gray-100 p-2 rounded-md drop-shadow-xl filter">
        <div className="flex">
          {/* Place Info */}
          <div className="text-left text-sm w-9/12">
            <p>
              {marker.street}
              {marker.addressNumber && `, ${marker.addressNumber}`}
            </p>
            <p>
              {marker.postalCode}
              {marker.municipality && ` ${marker.municipality}`}
              {marker.country && ", "}
              {marker.country}
            </p>
            <p className="text-xs text-gray-500">
              {marker.geometry.point[1]}, {marker.geometry.point[0]}
            </p>
          </div>
          {/* Routing button */}
          <div className="w-2/12 flex justify-center items-center">
            <Button
              title="Start Routing"
              className="transform rotate-45 cursor-pointer border bg-yellow-500 border-yellow-500 h-8 w-8 flex justify-center items-center drop-shadow-md filter"
              onPress={() => Hub.dispatch("Routing", { event: "startRouting" })}
            >
              <NavigationIcon
                width="24"
                height="24"
                className="transform -rotate-45 text-white"
              />
            </Button>
          </div>
          {/* Close toast button */}
          <div className="w-1/12 flex items-start justify-end">
            <Button
              title="Close"
              className="text-xs cursor-pointer"
              onPress={() => Hub.dispatch("Markers", { event: "closeToast" })}
            >
              ✖️
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkerToast;
