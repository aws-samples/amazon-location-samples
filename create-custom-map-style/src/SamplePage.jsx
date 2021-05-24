import React, { useRef, useState, useEffect } from 'react';
import transformRequest from './transformRequest';
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import mapboxgl from 'mapbox-gl';
import './SamplePage.css'

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg';

const SamplePage = () => {
  const maputnik = useRef();

  const [maputnikCoordinates, setMaputnikCoordinates] = useState({
    lat: 40.7356,
    lng: -74.0541,
    zoom: 12.44,
  });

  // MAPUTNIK MAP
  useEffect(async () => {
    const credentials = await Auth.currentCredentials();
    const { lat, lng, zoom } = maputnikCoordinates;
    const maputnikMap = new mapboxgl.Map({
      container: maputnik.current,
      center: { lng, lat },
      zoom,
      style: 'http://localhost:3000/example-style-descriptor.json',
      transformRequest: transformRequest(credentials),
    });
    maputnikMap.on('move', () => {
      setMaputnikCoordinates({
        lng: maputnikMap.getCenter().lng.toFixed(4),
        lat: maputnikMap.getCenter().lat.toFixed(4),
        zoom: maputnikMap.getZoom().toFixed(2),
      });
    });
    return () => maputnikMap.remove();
  }, []);

  return (
    <div className="sample-page">
      <h1>Amazon Location Service - Create Your Own Custom Map Style</h1>
      <div className="maputnik-container">
        <div className="maputnik-sidebar">
          <div>
            Longitude: {maputnikCoordinates.lng}
            <br />
            Latitude: {maputnikCoordinates.lat}
            <br />
            Zoom: {maputnikCoordinates.zoom}
            <br />
          </div>
        </div>
        <div ref={maputnik} className="maputnik-map" />
      </div>
      <hr />
    </div>
  )
}

export default withAuthenticator(SamplePage);

