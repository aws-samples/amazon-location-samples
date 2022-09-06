import './style.css'
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Source from 'ol/source/Source';
import { fromLonLat } from 'ol/proj';
import { ScaleLine } from 'ol/control';
import MapLibreLayer from '@geoblocks/ol-maplibre-layer';
import { Amplify } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import { Geo, AmazonLocationServiceMapStyle } from '@aws-amplify/geo';
import awsconfig from './aws-exports';
import { AmplifyMapLibreRequest } from 'maplibre-gl-js-amplify';

Amplify.configure(awsconfig);
const credentials = await Auth.currentCredentials();
const defaultMap = Geo.getDefaultMap() as AmazonLocationServiceMapStyle;
const { transformRequest } = new AmplifyMapLibreRequest(
    credentials,
    defaultMap.region
);

const map = new Map({
    target: 'map',
    layers: [
        new MapLibreLayer({
            maplibreOptions: {
                style: Geo.getDefaultMap().mapName,
                transformRequest: transformRequest,
            },
            source: new Source({
                attributions: [
                    '© 2022 HERE',
                ],
                attributionsCollapsible: false,
            }),
        }),
    ],
    view: new View({
        center: fromLonLat([139.767, 35.681]),
        zoom: 11,
    }),
});

map.addControl(new ScaleLine({
    units: 'metric'
}));
