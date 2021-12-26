<template>
    <div class="mapPane">
        <div id="map"></div>
    </div>
</template>

<script>
import L from 'leaflet';
import '@maplibre/maplibre-gl-leaflet';
import { Auth } from 'aws-amplify';
import { Geo } from '@aws-amplify/geo';
import { AmplifyMapLibreRequest } from 'maplibre-gl-js-amplify';

export default {
    name: 'MapPane',
    data() {
        return {};
    },
    mounted: async function () {
        const credentials = await Auth.currentCredentials();
        const { transformRequest } = new AmplifyMapLibreRequest(
            credentials,
            Geo.getDefaultMap().region
        );
        const attribution = await this.getAttribution(transformRequest);
        this.mapCreate(attribution, transformRequest);
    },
    methods: {
        mapCreate: async function (attribution, transformRequest) {
            const sample = L.maplibreGL({
                style: Geo.getDefaultMap().mapName,
                attribution: attribution,
                transformRequest: transformRequest,
            });
            const map = L.map('map', {
                center: [35.681, 139.767],
                zoom: 14,
                zoomControl: true,
                layers: [sample],
            });
            const Map_BaseLayer = {
                sample: sample,
            };
            L.control.layers(Map_BaseLayer, null).addTo(map);
        },
        getAttribution: async function (transformRequest) {
            try {
                const res = await fetch(
                    transformRequest(
                        `https://maps.geo.${
                            Geo.getDefaultMap().region
                        }.amazonaws.com/maps/v0/maps/${
                            Geo.getDefaultMap().mapName
                        }/style-descriptor`
                    ).url
                );
                const data = await res.json();
                if (Geo.getDefaultMap().style.indexOf('Esri') !== -1) {
                    return data.sources.esri.attribution;
                } else if (Geo.getDefaultMap().style.indexOf('Here') !== -1) {
                    return data.sources.omv.attribution;
                }
            } catch (err) {
                console.error(err);
            }
        },
    },
};
</script>

<style scoped>
#map {
    z-index: 0;
    height: 800px;
}
</style>
