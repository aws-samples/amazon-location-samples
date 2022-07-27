<template>
  <div>
    <el-container>
      <el-header>
        <el-form-item label="Pitch">
          <el-input-number v-model="pitch" :min="0" :max="60" :step="5" @change="pitchChange" />
        </el-form-item>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="12">
            <Map
              mapid="leftMap"
              :availableMaps="availableMaps"
              @updateState="updateState"
              :zoom="zoom"
              :center="center"
              :pitch="pitch"
            ></Map
          ></el-col>
          <el-col :span="12">
            <Map
              mapid="rightMap"
              :availableMaps="availableMaps"
              @updateState="updateState"
              :zoom="zoom"
              :center="center"
              :pitch="pitch"
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
    const updateState = (...args) => {
      zoom.value = args[0];
      center.value = args[1];
    };
    return {
      availableMaps,
      zoom,
      center,
      pitch,
      updateState,
    };
  },
};
</script>

<style>
@import '@/assets/style.css';
</style>
