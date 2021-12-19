<template>
    <div class="mapPane">
        <div id="map"></div>
    </div>
</template>

<script>
import L from 'leaflet';
import '@maplibre/maplibre-gl-leaflet';
import { Auth, Signer } from 'aws-amplify';
import awsconfig from '../aws-exports';

export default {
    name: 'MapPane',
    data() {
        return {
            credentials: null,
        };
    },
    mounted: async function () {
        this.credentials = await Auth.currentCredentials();
        this.mapCreate();
    },
    methods: {
        mapCreate: async function () {
            const sample = L.maplibreGL({
                style: 'leafletvue-dev',
                attribution: '© 2021 HERE',
                transformRequest: this.transformRequest,
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
        transformRequest: function (url, resourceType) {
            if (resourceType === 'Style' && !url.includes('://')) {
                url = `https://maps.geo.${awsconfig.aws_project_region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
            }
            if (url.includes('amazonaws.com')) {
                return {
                    url: Signer.signUrl(url, {
                        access_key: this.credentials.accessKeyId,
                        secret_key: this.credentials.secretAccessKey,
                        session_token: this.credentials.sessionToken,
                    }),
                };
            }
            return { url };
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
