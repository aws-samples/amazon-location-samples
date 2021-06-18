// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useRef, useState, useEffect } from 'react';
import transformRequest from './transformRequest';
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import maplibregl from 'maplibre-gl';
import './SamplePage.css'

const SamplePage = () => {
  const map = useRef();

  const [coordinates, setCoordinates] = useState({
    lat: 40.7356,
    lng: -74.0541,
    zoom: 12.44,
  });

  useEffect(async () => {
    const credentials = await Auth.currentCredentials();
    const { lat, lng, zoom } = coordinates;
    const demoMap = new maplibregl.Map({
      container: map.current,
      center: [lng, lat],
      zoom,
      style: `${process.env.PUBLIC_URL || 'http://localhost:3000'}/example-style-descriptor.json`,
      transformRequest: transformRequest(credentials),
    });
    demoMap.on('move', () => {
      setCoordinates({
        lng: demoMap.getCenter().lng.toFixed(4),
        lat: demoMap.getCenter().lat.toFixed(4),
        zoom: demoMap.getZoom().toFixed(2),
      });
    });
    return () => demoMap.remove();
  }, []);

  return (
    <div className="sample-page">
      <h1>Amazon Location Service - Create Your Own Custom Map Style</h1>
      <div className="map-container">
        <div className="demo-sidebar">
          <div>
            Longitude: {coordinates.lng}
            <br />
            Latitude: {coordinates.lat}
            <br />
            Zoom: {coordinates.zoom}
            <br />
          </div>
        </div>
        <div ref={map} className="demo-map" />
      </div>
      <hr />
    </div>
  )
}

export default withAuthenticator(SamplePage);
