<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-form :inline="true">
          <el-form-item label="Map Style">
            <el-select v-model="selectedMaps" @change="mapChange">
              <el-option v-for="map in availableMaps" :key="map.mapName" :label="map.style" :value="map.mapName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="id === 'right'" label="Pitch">
            <el-input-number v-model="inputPitch" :min="0" :max="60" :step="5" @change="pitchChange" />
          </el-form-item>
          <el-form-item v-if="id === 'right'" label="Sync">
            <el-switch v-model="sync" active-value="true" inactive-value="false" @change="syncChange" />
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
    zoom: Number,
    center: Object,
    pitch: Number,
    ActiveMap: String,
  },
  setup(props, context) {
    const selectedMaps = ref(Geo.getDefaultMap());
    const createdMap = ref(null);
    const inputPitch = ref(30);
    const sync = ref(true);

    const mapCreate = async () => {
      const map = await createMap({
        container: props.id,
        zoom: props.zoom,
        center: props.center,
        pitch: props.pitch,
      });
      map.addControl(createAmplifyGeocoder());

      map.on('movestart', () => {
        if (props.ActiveMap == null) {
          context.emit('active-map-update', props.id);
        } else if (props.id === props.ActiveMap) {
          context.emit('update-active-map', props.id);
        }
      });
      map.on('move', () => {
        if (props.id === props.ActiveMap) {
          context.emit('state-update', map.getZoom(), map.getCenter());
        }
      });

      map.on('moveend', () => {
        if (props.id === props.ActiveMap) {
          context.emit('active-map-update', null);
        }
      });

      createdMap.value = map;
    };

    mapCreate();

    const mapChange = function (value) {
      createdMap.value.setStyle(value);
      createdMap.value.resize();
    };

    const zoomChange = function (value) {
      if (null !== props.ActiveMap && props.id !== props.ActiveMap) {
        createdMap.value.setZoom(value);
      }
    };

    const centerChange = function (value) {
      if (null !== props.ActiveMap && props.id !== props.ActiveMap) {
        createdMap.value.setCenter(value);
      }
    };

    const pitchChange = function (value) {
      context.emit('pitch-update', inputPitch.value);
      createdMap.value.setPitch(value);
    };

    const syncChange = function (value) {
      sync.value = value;
    };

    return {
      selectedMaps,
      inputPitch,
      sync,
      mapChange,
      zoomChange,
      centerChange,
      pitchChange,
      syncChange,
    };
  },
  watch: {
    zoom: 'zoomChange',
    center: 'centerChange',
    pitch: 'pitchChange',
  },
};
</script>
