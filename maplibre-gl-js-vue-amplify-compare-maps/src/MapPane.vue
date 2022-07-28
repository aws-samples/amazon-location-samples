<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-form inline="true">
          <el-form-item label="Map Style">
            <el-select v-model="selectedMaps" placeholder="Select" @change="mapChange">
              <el-option v-for="map in availableMaps" :key="map.mapName" :label="map.style" :value="map.mapName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <div :id="id" class="map"></div>
  </el-card>
</template>

<script>
import { createMap, createAmplifyGeocoder } from 'maplibre-gl-js-amplify';
import { Geo } from 'aws-amplify';
import { ref } from 'vue';

export default {
  props: {
    id: String,
    availableMaps: Array,
    zoom: Array,
    center: Number,
    pitch: Number,
    ActiveMap: String,
  },
  setup(props, context) {
    const selectedMaps = ref(Geo.getDefaultMap());
    const createdMap = ref(null);

    const mapCreate = async () => {
      const map = await createMap({
        container: props.id,
        zoom: props.zoom,
        center: props.center,
        pitch: props.pitch,
      });
      map.addControl(createAmplifyGeocoder());

      map.on('movestart', () => {
        context.emit('updateActiveMap', props.id);
      });
      map.on('move', () => {
        if (props.id === props.ActiveMap) {
          //console.log(props.id);
          context.emit('updateState', map.getZoom(), map.getCenter());
        }
      });
      createdMap.value = map;
    };

    mapCreate();

    const mapChange = (value) => {
      createdMap.value.setStyle(value);
    };

    const zoomChange = (value) => {
      createdMap.value.setZoom(value);
    };

    const centerChange = (value) => {
      createdMap.value.jumpTo({ center: value });
    };

    const pitchChange = (value) => {
      createdMap.value.setPitch(value);
    };

    return {
      selectedMaps,
      mapChange,
      zoomChange,
      centerChange,
      pitchChange,
    };
  },
  watch: {
    zoom: 'zoomChange',
    center: 'centerChange',
    pitch: 'pitchChange',
  },
};
</script>
