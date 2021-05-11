// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

import React, { useState, useEffect, useMemo } from "react";
import { Auth } from "aws-amplify";
import Location from "aws-sdk/clients/location";
import awsmobile from "./aws-exports";
import { Signer } from "@aws-amplify/core";
import ReactMapGL, { NavigationControl, Marker, Popup } from "react-map-gl";
import CityPin from "./CityPin";
import PolylineOverlay from "./PolylineOverlay";

function LocationMap() {
  const mapName = "assetTracker";
  const [credentials, setCredentials] = useState(null);
  const [viewport, setViewport] = useState({
    longitude: -123.1187,
    latitude: 49.2819,
    zoom: 10,
  });
  const [showPopup, togglePopup] = React.useState(false);
  const [markers, setMarkers] = useState([]);
  const [locationClient, setLocationClient] = useState(null);
  let trackerParams = {
    DeviceId: "thing123" /* required */,
    TrackerName: "trackedAsset01" /* required */,
    EndTimeExclusive: null,
    StartTimeInclusive: null,
  };
  const [popupInfo, setPopupInfo] = useState(null);

  //Check if there are credentials set, if not, get credentials
  async function getUserCredentials() {
    let currCredentials;
    try {
      currCredentials = await Auth.currentCredentials();
      if ("sessionToken" in currCredentials) {
        return setCredentials(currCredentials);
      } else throw new Error("Not Authenticated");
    } catch (err) {
      alert(err);
      return null;
    }
  }

  /**
   * Create and Amazon Location Client using AWS SDK and Render the Map;
   *
   */
  function initLocationClient() {
    try {
      const newLocationClient = new Location({
        credentials: credentials,
        region: awsmobile.aws_project_region,
      });
      return setLocationClient(newLocationClient);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    const getCredentials = async () => await getUserCredentials();
    getCredentials();
  }, []);

  useEffect(() => {
    if (credentials && !locationClient) {
      initLocationClient(credentials);
    }
  }, [credentials]);

  useEffect(() => {
    if (locationClient && credentials) {
      getAssetPositions();
    }
  }, [locationClient]);

  /**
   * Gets asset positions from the last X days. and focus map on last position.
   */
  async function getAssetPositions() {
    //Get the Tracker Positions from the last 3 days
    trackerParams.EndTimeExclusive = new Date();
    trackerParams.StartTimeInclusive = new Date(
      new Date().setDate(trackerParams.EndTimeExclusive.getDate() - 30)
    );

    /**
     * Get Trackers History using the params Define in the Class state
     */
    let actualTrackerData = await locationClient
      .getDevicePositionHistory(trackerParams)
      .promise();

    if (actualTrackerData.DevicePositions.length > 0) {
      setMarkers(actualTrackerData.DevicePositions);

      const currPos = actualTrackerData.DevicePositions.length - 1;

      setViewport({
        longitude: actualTrackerData.DevicePositions[currPos].Position[0],
        latitude: actualTrackerData.DevicePositions[currPos].Position[1],
        zoom: 16,
      });
    }
  }

  /**
   * Create React Map Gl markers.
   */
  const mapMarkers = React.useMemo(
    () =>
      markers.map((devicePositionMetadata, index) => (
        <Marker
          key={`marker${index}`}
          longitude={devicePositionMetadata.Position[0]}
          latitude={devicePositionMetadata.Position[1]}
        >
          {index == markers.length - 1 ? (
            <CityPin
              key={`pin${index}`}
              trackerData={devicePositionMetadata}
              onClick={setPopupInfo}
              curr={true}
            />
          ) : (
            <CityPin
              trackerData={devicePositionMetadata}
              onClick={setPopupInfo}
            />
          )}
        </Marker>
      )),
    [markers]
  );

  /**
   * Draw a Line Overlay connecting markers.
   */
  const lines = React.useMemo(() => <PolylineOverlay points={markers} />, [
    markers,
  ]);

  /**
   * Sign requests made by Mapbox GL using AWS SigV4.
   */
  function transformRequest(url, resourceType) {
    try {
      if (resourceType === "Style" && !url.includes("://")) {
        // resolve to an AWS URL
        url = `https://maps.geo.${awsmobile.aws_project_region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
      }
      if (url.includes("amazonaws.com")) {
        // only sign AWS requests (with the signature as part of the query string)
        url = Signer.signUrl(url, {
          access_key: credentials.accessKeyId,
          secret_key: credentials.secretAccessKey,
          session_token: credentials.sessionToken,
        });
        return {
          url: url || "",
        };
      }

      // don't sign
      return { url };
    } catch (error) {
      alert(error);
    }

    return null;
  }

  return (
    <div className="mapholder">
      {credentials ? (
        <div>
          {locationClient ? (
            <ReactMapGL
              {...viewport}
              width="100%"
              height="100vh"
              transformRequest={transformRequest}
              mapStyle={mapName}
              onViewportChange={setViewport}
            >
              <NavigationControl showCompass={false} />
              {/* The order overlay > markers is important to enable popups. */}
              {lines}
              {mapMarkers}
              {popupInfo && (
                <Popup
                  tipSize={5}
                  anchor="top"
                  longitude={popupInfo.longitude}
                  latitude={popupInfo.latitude}
                  closeOnClick={false}
                  onClose={setPopupInfo}
                >
                  <p>
                    <span>Date {popupInfo.date}</span>
                    <br />
                    <span>Time {popupInfo.time}</span>
                    <br />
                    <span>Latitude: {popupInfo.latitude}</span>
                    <br />
                    <span>Longitude: {popupInfo.longitude}</span>
                  </p>
                </Popup>
              )}
            </ReactMapGL>
          ) : (
            <h2>Loading ...</h2>
          )}
        </div>
      ) : (
        <h2>Getting Credentials...</h2>
      )}
    </div>
  );
}

export default LocationMap;
