<template>
    <div class="mapPane">
        <div id="map"></div>
    </div>
</template>

<script>
import { createMap } from 'maplibre-gl-js-amplify';

export default {
    name: 'MapPane',
    data() {
        return {};
    },
    mounted: async function () {
        this.mapCreate();
    },
    methods: {
        mapCreate: async function () {
            const map = await createMap({
                container: 'map',
                center: [139.7648, 35.6794],
                zoom: 15,
                bearing: 64.8,
                pitch: 60,
                hash: true,
            });
            map.on('load', function () {});
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
