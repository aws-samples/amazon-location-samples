<template>
  <main>
    <header>
      <h1>Amazon Location × Amplify Geo</h1>
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
          :sync="sync"
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

<script>
import { Geo } from 'aws-amplify';
import { ref } from 'vue';
import Map from './MapPane.vue';

export default {
  components: { Map },
  setup() {
    const availableMaps = ref(Geo.getAvailableMaps());
    const zoom = ref(14);
    const center = ref([139.7648, 35.6794]);
    const pitch = ref(30);
    const bearing = ref(0);
    const sync = ref(true);
    const ActiveMap = ref(null);

    function updateState(...args) {
      zoom.value = args[0];
      center.value = args[1];
      bearing.value = args[2];
      pitch.value = args[3];
    }

    function updateActiveMap(...args) {
      ActiveMap.value = args[0];
    }

    return {
      availableMaps,
      zoom,
      center,
      pitch,
      bearing,
      ActiveMap,
      updateState,
      updateActiveMap,
    };
  },
};
</script>

<style>
@import '@/assets/style.css';
</style>
