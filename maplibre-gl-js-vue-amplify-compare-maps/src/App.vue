<template>
  <div>
    <el-container>
      <el-header>
        <el-form inline="true">
          <el-form-item label="Pitch">
            <el-input-number v-model="pitch" :min="0" :max="60" :step="5" @change="pitchChange" />
          </el-form-item>
          <el-form-item>
            <el-switch v-model="sync" active-text="Sync" inactive-text="Not Sync" />
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="12">
            <Map
              id="left"
              :availableMaps="availableMaps"
              @updateState="updateState"
              @updateActiveMap="updateActiveMap"
              :zoom="zoom"
              :center="center"
              :pitch="pitch"
              :ActiveMap="ActiveMap"
            ></Map
          ></el-col>
          <el-col :span="12">
            <Map
              id="right"
              :availableMaps="availableMaps"
              @updateState="updateState"
              @updateActiveMap="updateActiveMap"
              :zoom="zoom"
              :center="center"
              :pitch="pitch"
              :ActiveMap="ActiveMap"
            ></Map
          ></el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
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
    const sync = ref(true);
    const ActiveMap = ref('left');

    const updateState = (...args) => {
      zoom.value = args[0];
      center.value = args[1];
    };

    const updateActiveMap = (...args) => {
      ActiveMap.value = args[0];
    };
    return {
      availableMaps,
      zoom,
      center,
      pitch,
      sync,
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
