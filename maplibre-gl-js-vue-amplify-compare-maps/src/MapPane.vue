<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-form :inline="true">
          <el-form-item label="Map Style">
            <el-select v-model="renderedMap">
              <el-option v-for="map in availableMaps" :key="map.mapName" :label="map.style" :value="map.mapName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="id === 'right'" label="Pitch">
            <el-input-number v-model="num" :min="0" :max="60" :step="5" />
          </el-form-item>
          <el-form-item v-if="id === 'right'" label="Sync">
            <el-switch v-model="toggle" />
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
import { ref, watch, toRefs } from 'vue';

export default {
  props: {
    id: String,
    availableMaps: Array,
    zoom: Number,
    center: Object,
    pitch: Number,
    ActiveMap: String,
    sync: Boolean,
  },
  setup(props, context) {
    const renderedMap = ref(Geo.getDefaultMap());
    const map = ref(null);
    const toggle = ref(true);
    const num = ref(30);
    const { id, zoom, center, pitch, sync, ActiveMap } = toRefs(props);

    const mapCreate = async () => {
      map.value = await createMap({
        container: id.value,
        zoom: zoom.value,
        center: center.value,
        pitch: pitch.value,
      });
      map.value.addControl(createAmplifyGeocoder());

      map.value.on('movestart', () => {
        if (ActiveMap.value == null && sync.value) {
          context.emit('active-map-update', id.value);
        }
      });
      map.value.on('move', () => {
        if (ActiveMap.value == id.value || ActiveMap.value == null) {
          context.emit('state-update', map.value.getZoom(), map.value.getCenter());
        }
      });

      map.value.on('moveend', () => {
        if (ActiveMap.value == id.value) {
          context.emit('active-map-update', null);
        }
      });
    };

    mapCreate();

    watch(renderedMap, (renderedMap) => {
      map.value.setStyle(renderedMap);
    });

    watch(zoom, (zoom) => {
      if (ActiveMap.value && ActiveMap.value !== id.value && sync.value) {
        map.value.setZoom(zoom);
      }
    });

    watch(center, (center) => {
      if (ActiveMap.value && ActiveMap.value !== id.value && sync.value) {
        map.value.setCenter([center.lng, center.lat]);
      }
    });

    watch(num, (num) => {
      context.emit('pitch-update', num);
    });

    watch(pitch, (pitch) => {
      map.value.setPitch(pitch);
    });

    watch(toggle, (toggle) => {
      context.emit('sync-update', toggle);
    });

    return {
      renderedMap,
      num,
      toggle,
    };
  },
};
</script>
