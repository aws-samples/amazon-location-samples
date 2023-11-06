<script setup>
import { Geo } from 'aws-amplify';
import { ref } from 'vue';
import Map from './MapPane.vue';

// Common properties shared between Map components
const availableMaps = ref(Geo.getAvailableMaps());
const zoom = ref(14);
const center = ref([139.7648, 35.6794]);
const bearing = ref(0);
const pitch = ref(30);
const ActiveMap = ref(null);

// Function to update the map state
const updateState = (...args) => {
  zoom.value = args[0];
  center.value = args[1];
  bearing.value = args[2];
  pitch.value = args[3];
};

// Function to update the active map
const updateActiveMap = (...args) => {
  ActiveMap.value = args[0];
};
</script>

<template>
  <main>
    <header>
      <h1>Amazon Location Service × Amplify Geo</h1>
    </header>
    <section>
      <div>
        <Map
          id="left"
          :availableMaps="availableMaps"
          @state-update="updateState"
          @active-map-update="updateActiveMap"
          :zoom="zoom"
          :center="center"
          :pitch="pitch"
          :bearing="bearing"
          :ActiveMap="ActiveMap"
        />
      </div>
      <div>
        <Map
          id="right"
          :availableMaps="availableMaps"
          @state-update="updateState"
          @active-map-update="updateActiveMap"
          :zoom="zoom"
          :center="center"
          :pitch="pitch"
          :bearing="bearing"
          :ActiveMap="ActiveMap"
        />
      </div>
    </section>
  </main>
</template>

<style>
@import '@/assets/style.css';
</style>
