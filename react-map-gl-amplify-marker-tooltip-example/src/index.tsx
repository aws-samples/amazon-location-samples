// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StrictMode, useEffect, useState, useRef } from "react";
import Amplify, { Auth } from "aws-amplify";
import {
  Geo,
  AmazonLocationServiceMapStyle,
  Coordinates,
} from "@aws-amplify/geo";
import { AmplifyMapLibreRequest } from "maplibre-gl-js-amplify";
import Map, {
  NavigationControl,
  ViewState,
  Marker,
  Popup,
  MapLayerMouseEvent,
} from "react-map-gl";
import ReactDOM from "react-dom";

import awsconfig from "./aws-exports";

import "maplibre-gl/dist/maplibre-gl.css";
import "./index.css";

// initialize Amplify (auth, etc.)
Amplify.configure(awsconfig);

const App = () => {
  const [transformerReady, setTransformerReady] = useState<boolean>(false);
  const amplifyMaplibre = useRef<AmplifyMapLibreRequest>();

  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: -123.1187,
    latitude: 49.2819,
    zoom: 10,
  });
  const [marker, setMarker] =
    useState<{ latitude: number; longitude: number; label: string }>();

  useEffect(() => {
    const createTransformer = async () => {
      if (!transformerReady) {
        // fetch AWS credentials from Amazon Cognito using Amplify Auth
        const credentials = await Auth.currentCredentials();
        // create a new AmplifyMapLibreRequest instance and save it in a ref
        // so it persists re-renders and takes care of renewing the AWS credentials
        amplifyMaplibre.current = new AmplifyMapLibreRequest(
          credentials,
          (Geo.getDefaultMap() as AmazonLocationServiceMapStyle).region
        );
        // Set the transformerReady state to true to re-render the component
        setTransformerReady(true);
      }
    };

    createTransformer();
  }, [transformerReady]);

  const handleMapClick = async (event: MapLayerMouseEvent) => {
    const { lngLat } = event;

    try {
      const point = await Geo.searchByCoordinates(
        lngLat.toArray() as Coordinates
      );
      setMarker({
        longitude: point.geometry?.point[0] || 0,
        latitude: point.geometry?.point[1] || 0,
        label: point.label || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {amplifyMaplibre.current && transformerReady ? (
        <Map
          {...viewState}
          style={{ width: "100%", height: "100vh" }}
          transformRequest={amplifyMaplibre.current.transformRequest}
          mapStyle={Geo.getDefaultMap().mapName}
          onMove={(e) => setViewState(e.viewState)}
          onClick={(e) => handleMapClick(e)}
        >
          <NavigationControl showCompass={false} />
          {marker ? (
            <>
              <Popup
                longitude={marker.longitude}
                latitude={marker.latitude}
                closeButton
                closeOnClick
                onClose={() => {
                  setMarker(undefined);
                }}
                offset={[0, -35]}
                anchor="bottom"
              >
                {marker.label}
              </Popup>
              <Marker
                longitude={marker.longitude}
                latitude={marker.latitude}
                color="red"
              />
            </>
          ) : null}
        </Map>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
