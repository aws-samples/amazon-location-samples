<script setup>
import { createMap, createAmplifyGeocoder } from 'maplibre-gl-js-amplify';
import { NavigationControl } from 'maplibre-gl';
import { Geo } from 'aws-amplify';
import { ref, watchEffect, toRefs } from 'vue';

// Define props and emits for the component
const props = defineProps({
  id: String,
  availableMaps: Array,
  zoom: Number,
  center: Object,
  bearing: Number,
  pitch: Number,
  ActiveMap: String,
});

const emits = defineEmits(['active-map-update', 'state-update']);

// Initialize reactive variables
const renderedMap = ref(Geo.getDefaultMap().mapName);
const map = ref(null);
const { id, zoom, center, pitch, bearing, ActiveMap } = toRefs(props);

// Function to create and set up the map
const mapCreate = async () => {
  try {
    // Create the map instance
    map.value = await createMap({
      container: id.value,
      zoom: zoom.value,
      center: center.value,
      pitch: pitch.value,
      bearing: bearing.value,
    });

    // Add geocoder and navigation controls to the map
    map.value.addControl(createAmplifyGeocoder({ flyTo: { maxZoom: 14 } }));
    map.value.addControl(new NavigationControl({ visualizePitch: true }));

    // Listen for mouseover event and emit 'active-map-update'
    map.value.on('mouseover', () => {
      emits('active-map-update', id.value);
    });

    // Listen for move event and emit 'state-update' if it's the active map
    map.value.on('move', () => {
      if (ActiveMap.value == id.value) {
        emits('state-update', map.value.getZoom(), map.value.getCenter(), map.value.getBearing(), map.value.getPitch());
      }
    });

    // Watch for changes in renderedMap and update map style
    // Also, if it's not the active map, update other properties
    watchEffect(() => {
      map.value.setStyle(renderedMap.value);
      if (ActiveMap.value !== id.value) {
        map.value.setZoom(zoom.value);
        map.value.setCenter(center.value);
        map.value.setBearing(bearing.value);
        map.value.setPitch(pitch.value);
      }
    });
  } catch (error) {
    console.error('An error occurred while creating the map:', error);
  }
};

// Initialize the map when the component is created
mapCreate();
</script>

<template>
  <div class="map-header">
    <div>
      <label>Map Style: </label>
      <select v-model="renderedMap">
        <option v-for="map in availableMaps" :key="map.mapName" :label="map.style" :value="map.mapName" />
      </select>
    </div>
  </div>
  <div :id="id" class="map" />
</template>
