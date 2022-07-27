<template>
    <el-card class="box-card">
        <template #header>
        <div class="card-header">
            <el-form inline="true">
                <el-form-item label="Map Style">
                    <el-select v-model="selectedMaps" placeholder="Select" @change="mapChange">
                        <el-option
                        v-for="map in availableMaps"
                        :key="map.mapName"
                        :label="map.style"
                        :value="map.mapName"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Pitch">
                    <el-input-number v-model="selectedPitch" :min="0" :max="60" :step="5" @change="pitchChange" />
                </el-form-item>
            </el-form>
        </div> 
        </template>
        <div id="leftMap" class="map"></div>
    </el-card>
</template>

<script>
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify";
import { Geo } from "aws-amplify"
import { ref } from 'vue'

export default {
    setup() {
        const selectedPitch = ref(30)
        const availableMaps = Geo.getAvailableMaps()
        const selectedMaps = ref(Geo.getDefaultMap())
        const createdMap = ref(null)
        const mapCreate = async () => {
            const map = await createMap({
                container: 'leftMap',
                center: [139.7648, 35.6794],
                zoom: 14,
                pitch: selectedPitch.value,
            });
            map.addControl(createAmplifyGeocoder())
            createdMap.value = map
        }

        mapCreate()

        const mapChange = (value) => {
            createdMap.value.setStyle(value)
        }

        const pitchChange = (value) => {
            createdMap.value.setPitch(value)
        }
        
        return {
            selectedPitch,
            availableMaps,
            selectedMaps,
            mapChange,
            pitchChange,
        }

    }
};
</script>