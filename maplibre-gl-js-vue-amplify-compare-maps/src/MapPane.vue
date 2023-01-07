<template>
  <div class="map-header">
    <div>
      <label>Map Style</label>
      <select v-model="renderedMap">
        <option v-for="map in availableMaps" :key="map.mapName" :label="map.style" :value="map.mapName" />
      </select>
    </div>
  </div>
  <div :id="id" class="map"></div>
</template>

<script>
import { createMap, createAmplifyGeocoder } from 'maplibre-gl-js-amplify';
import { NavigationControl } from 'maplibre-gl';
import { Geo } from 'aws-amplify';
import { ref, watch, toRefs } from 'vue';

export default {
  props: {
    id: String,
    availableMaps: Array,
    zoom: Number,
    center: Object,
    pitch: Number,
    bearing: Number,
    ActiveMap: String,
  },
  setup(props, context) {
    const renderedMap = ref(Geo.getDefaultMap().mapName);
    const map = ref(null);
    const { id, zoom, center, pitch, bearing, ActiveMap } = toRefs(props);

    const mapCreate = async () => {
      map.value = await createMap({
        container: id.value,
        zoom: zoom.value,
        center: center.value,
        pitch: pitch.value,
        bearing: bearing.value,
      });

      map.value.addControl(createAmplifyGeocoder());
      map.value.addControl(new NavigationControl({ visualizePitch: true }));

      map.value.on('mouseover', () => {
        context.emit('active-map-update', id.value);
      });

      map.value.on('move', () => {
        if (ActiveMap.value == id.value) {
          context.emit(
            'state-update',
            map.value.getZoom(),
            map.value.getCenter(),
            map.value.getBearing(),
            map.value.getPitch()
          );
        }
      });
    };

    mapCreate();

    watch(renderedMap, (renderedMap) => {
      map.value.setStyle(renderedMap);
    });

    watch(zoom, (zoom) => {
      if (ActiveMap.value !== id.value) {
        map.value.setZoom(zoom);
      }
    });

    watch(center, (center) => {
      if (ActiveMap.value !== id.value) {
        map.value.setCenter([center.lng, center.lat]);
      }
    });

    watch(bearing, (bearing) => {
      if (ActiveMap.value !== id.value) {
        map.value.setBearing(bearing);
      }
    });

    watch(pitch, (pitch) => {
      if (ActiveMap.value !== id.value) {
        map.value.setPitch(pitch);
      }
    });

    return {
      renderedMap,
    };
  },
};
</script>
