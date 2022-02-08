// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useCallback, useEffect, useState } from "react";
import {
  CalculateRouteCommand,
  LocationClient,
} from "@aws-sdk/client-location";
import { Auth } from "@aws-amplify/auth";
import { Geo } from "@aws-amplify/geo";
import { AmplifyMapLibreRequest } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";

// Custom hook to use the AWS Location Service & Amplify Geo
const useAmazonLocationService = () => {
  const [credentials, setCredentials] = useState(null);
  const [transformRequest, setRequestTransformer] = useState();
  const [locationClient, setLocationClient] = useState(null);
  // Using the name convention `RouteCalculator-${mapName}`
  // because Amplify Geo doesn't support RouteCalculator yet
  const calculatorName = `RouteCalculator-${Geo.getDefaultMap().mapName}`;

  // Custom function to calculate route since Amplify Geo doesn't support it yet
  const calculateRoute = useCallback(
    async (
      travelMode,
      waypoints,
      carOptions,
      truckOptions,
      departureTime,
      distanceUnit,
      includeLegGeometry = true
    ) => {
      // Create base input for the route calculator
      const commandInput = {
        CalculatorName: calculatorName,
        TravelMode: travelMode,
        DeparturePosition: waypoints[0],
        DestinationPosition: waypoints[waypoints.length - 1],
        IncludeLegGeometry: includeLegGeometry,
      };
      // Set options based on travel mode
      if (travelMode === "Car") {
        commandInput["CarModeOptions"] = carOptions;
      } else if (travelMode === "Truck") {
        const truckModeOptions = { ...truckOptions };
        // If units are the only parameters specified delete them
        if (
          Object.keys(truckModeOptions.Dimensions).length === 0 ||
          (Object.keys(truckModeOptions.Dimensions).length === 1 &&
            "Unit" in truckModeOptions.Dimensions)
        ) {
          delete truckModeOptions.Dimensions;
        }
        if (
          Object.keys(truckModeOptions.Weight).length === 0 ||
          (Object.keys(truckModeOptions.Weight).length === 1 &&
            "Unit" in truckModeOptions.Weight)
        ) {
          delete truckModeOptions.Weight;
        }
        commandInput["TruckModeOptions"] = truckModeOptions;
      }
      if (departureTime !== null) {
        commandInput["DepartureTime"] = departureTime;
      }
      if (distanceUnit !== null && distanceUnit !== "Kilometers") {
        commandInput["DistanceUnit"] = distanceUnit;
      }

      const command = new CalculateRouteCommand(commandInput);
      const res = await locationClient.send(command);
      return res;
    },
    [locationClient, calculatorName]
  );

  // Side effect to get the temporary credentials from Amazon Cognito
  useEffect(() => {
    async function getCredentials() {
      const credentials = await Auth.currentCredentials();
      setCredentials(credentials);
    }

    getCredentials();
  }, []);

  // Side effect to create a requestTransformer for the Map
  useEffect(() => {
    const makeRequestTransformer = async () => {
      if (credentials !== null) {
        const amplifyRequest = new AmplifyMapLibreRequest(
          credentials,
          Geo.getDefaultMap().region
        );
        setRequestTransformer(() => amplifyRequest.transformRequest);
      }
    };

    makeRequestTransformer();
  }, [credentials]);

  // Side effect to create a LocationClient, needed for the route calculator
  useEffect(() => {
    const makeLocationClient = async () => {
      if (locationClient === null && credentials !== null) {
        const client = new LocationClient({
          credentials: credentials,
          region: Geo.getDefaultMap().region,
        });
        setLocationClient(client);
      }
    };

    makeLocationClient();
  }, [credentials, locationClient]);

  return [
    transformRequest,
    Geo.getDefaultMap().mapName,
    calculateRoute,
    locationClient,
  ];
};

export default useAmazonLocationService;
