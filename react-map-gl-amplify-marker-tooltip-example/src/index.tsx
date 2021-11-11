// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { ICredentials } from "@aws-amplify/core";
import { Geo, AmazonLocationServiceMapStyle } from "@aws-amplify/geo";
import Amplify, { Auth } from "aws-amplify";
import { AmplifyMapLibreRequest } from "maplibre-gl-js-amplify";
import { StrictMode, useEffect, useState, memo } from "react";
import ReactDOM from "react-dom";
import ReactMapGL, {
  MapRequest,
  NavigationControl,
  ViewportProps,
  MapEvent,
  Marker,
  Popup,
} from "react-map-gl";

import awsconfig from "./aws-exports";

import "maplibre-gl/dist/maplibre-gl.css";
import "./index.css";
import { TransformRequestFunction } from "maplibre-gl";

// initialize Amplify (auth, etc.)
Amplify.configure(awsconfig);

const Pin = memo((props: Partial<{
  size: number,
}>) => {
  const { size } = props;
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" style={{fill: '#d00', stroke: 'none'}}>
      <path d="M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9C20.1,15.8,20.2,15.8,20.2,15.7z" />
    </svg>
  )
});

const App = () => {
  const [credentials, setCredentials] = useState<ICredentials>();
  const [transformRequest, setRequestTransformer] =
    useState<TransformRequestFunction>();

  const [viewport, setViewport] = useState<Partial<ViewportProps>>({
    longitude: -123.1187,
    latitude: 49.2819,
    zoom: 10,
  });
  const [marker, setMarker] = useState<{latitude: number, longitude: number, label: string}>();

  useEffect(() => {
    // fetch AWS credentials from Amazon Cognito using Amplify Auth
    const fetchCredentials = async () => {
      setCredentials(await Auth.currentUserCredentials());
    };

    fetchCredentials();
  }, []);

  // create a new transformRequest function whenever the credentials change
  useEffect(() => {
    if (credentials != null) {
      const { transformRequest } = new AmplifyMapLibreRequest(
        credentials,
        (Geo.getDefaultMap() as AmazonLocationServiceMapStyle).region
      );

      // wrap the new value in an anonymous function to prevent React from recognizing it as a
      // function and immediately calling it
      setRequestTransformer(() => transformRequest);
    }
  }, [credentials]);

  const handleMapClick = async (event: MapEvent) => {
    const { lngLat } = event;

    try {
      const point = await Geo.searchByCoordinates(lngLat);
      setMarker({
        longitude: point.geometry?.point[0] || 0,
        latitude: point.geometry?.point[1] || 0,
        label: point.label || '',
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {transformRequest ? (
        <ReactMapGL
          {...viewport}
          width="100%"
          height="100vh"
          transformRequest={
            transformRequest as (
              url?: string,
              resourceType?: string
            ) => MapRequest
          }
          mapStyle={Geo.getDefaultMap().mapName}
          onViewportChange={setViewport}
          onClick={handleMapClick}
        >
          <div style={{ position: "absolute", left: 20, top: 20 }}>
            <NavigationControl showCompass={false} />
          </div>
          {
            marker ? (
              <>
              <Popup
                longitude={marker.longitude}
                latitude={marker.latitude}
                closeButton
                closeOnClick
                onClose={() => {
                  setMarker(undefined);
                }}
                offsetLeft={10}
              >{marker.label}</Popup>
              <Marker
                longitude={marker.longitude}
                latitude={marker.latitude}
              ><Pin size={20} /></Marker>
              </>
            ) : null
          }
        </ReactMapGL>
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
