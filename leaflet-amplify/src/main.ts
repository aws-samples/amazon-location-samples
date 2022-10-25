import './style.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '@maplibre/maplibre-gl-leaflet';
import { Amplify } from '@aws-amplify/core';
import { Auth } from '@aws-amplify/auth';
import { Geo, AmazonLocationServiceMapStyle } from '@aws-amplify/geo';
import awsconfig from './aws-exports';
import { AmplifyMapLibreRequest } from 'maplibre-gl-js-amplify';
L.Icon.Default.imagePath = 'img/icon/';

Amplify.configure(awsconfig);
const credentials = await Auth.currentCredentials();
const defaultMap = Geo.getDefaultMap() as AmazonLocationServiceMapStyle;
const { transformRequest } = new AmplifyMapLibreRequest(
    credentials,
    defaultMap.region
);

const map = L.map('map', {
    center: [35.681, 139.767],
    zoom: 11,
    layers: [
        L.maplibreGL({
            style: Geo.getDefaultMap().mapName,
            transformRequest: transformRequest,
        })
    ],
});
map.attributionControl.addAttribution(
    '© 2022 HERE'
);