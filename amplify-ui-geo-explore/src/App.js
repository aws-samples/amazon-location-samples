// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState, useEffect } from "react";
import Amplify, { Auth } from "aws-amplify";
import { LocationClient } from "@aws-sdk/client-location";
import { IDENTITY_POOL_ID, REGION, MAP, PLACE } from "./configuration";
import PlacesLayer from "./components/places/PlacesLayer";
import RoutesLayer from "./components/routes/RoutesLayer";
import { MapView } from "@aws-amplify/ui-react";
import { NavigationControl } from "react-map-gl";
import WebMercatorViewport from "@math.gl/web-mercator";
import "@aws-amplify/ui-react/styles.css";
import "./index.css";

// Configuring Amplify Geo with existing Amazon Cognito and Amazon Location Service information
// Fill values in configuration.js
Amplify.configure({
  Auth: {
    identityPoolId: IDENTITY_POOL_ID, // REQUIRED - Amazon Cognito Identity Pool ID
    region: REGION, // REQUIRED - Amazon Cognito Region
  },
  geo: {
    AmazonLocationService: {
      maps: {
        items: {
          [MAP.NAME]: { // REQUIRED - Amazon Location Service Map resource name
            style: MAP.STYLE, // REQUIRED - String representing the style of map resource
          },
        },
        default: MAP.NAME, // REQUIRED - Amazon Location Service Map resource name to set as default
      },
      search_indices: {
        items: [PLACE], // REQUIRED - Amazon Location Service Place Index name
        default: PLACE, // REQUIRED - Amazon Location Service Place Index name to set as default
      },
      region: REGION, // REQUIRED - Amazon Location Service Region
    },
  },
});

const App = () => {
  const [credentials, setCredentials] = useState();
  const [client, setClient] = useState();
  const [viewport, setViewport] = useState({
    longitude: -123.1187,
    latitude: 49.2819,
    zoom: 11,
  });
  const [clickedLngLat, setClickedLngLat] = useState();

  //Fetch credentials when the app loads
  useEffect(() => {
    const fetchCredentials = async () => {
      // Fetch AWS credentials from Amazon Cognito using Amplify Auth and storing it in state
      setCredentials(await Auth.currentUserCredentials());
    };
    fetchCredentials();
  }, []);

  // Instantiate client for aws-sdk whenever the credentials change
  useEffect(() => {
    if (credentials != null) {
      // Instantiate client for aws-sdk method calls
      const client = new LocationClient({
        credentials,
        region: REGION,
      });

      setClient(client);
    }
  }, [credentials]);

  // Adjust the viewport based on bounding box
  const handleViewportChangeFromLayer = (bbox) => {
    if (bbox) {
      // Adjusting viewport based on bounding box array input
      const boundingBox = [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ];

      // Get the new viewport based on the bounding box
      const newViewport = new WebMercatorViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        ...viewport,
      }).fitBounds(boundingBox, {
        padding: 250,
      });

      setViewport(newViewport);
    }
  };

  // Store coordinates of clicked position on the map
  const handleMapClick = (e) => {
    if (e.lngLat) {
      setClickedLngLat(e.lngLat);
    }
  };

  return (
    <>
      {client ? (
        <MapView
          {...viewport}
          width="100%"
          height="100vh"
          mapStyle={MAP.NAME}
          onMove={(e) => setViewport(e.viewState)}
          onClick={handleMapClick}
        >
          <NavigationControl position="bottom-right" />
          <PlacesLayer />
          <RoutesLayer
            client={client}
            clickedLngLat={clickedLngLat}
            onViewportChangeFromLayer={handleViewportChangeFromLayer}
          />
        </MapView>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
};

export default App;
