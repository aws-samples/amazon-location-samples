<template>
  <div class="flow-root my-5 overflow-y-scroll max-h-64">
    <ul role="list" class="-mb-8">
      <li v-for="(position, index) in positions" :key="index">
        <div class="relative pb-8">
          <span
            v-if="index !== positions.length - 1"
            class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
          <div class="relative flex space-x-3">
            <div class="flex items-center">
              <span
                class="bg-gray-100 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
              >
                <component
                  :is="MapPinIcon"
                  class="h-5 w-5 text-blue-500"
                  aria-hidden="true"
                />
              </span>
            </div>
            <div class="flex min-w-0 flex-1 justify-between space-x-4">
              <div>
                <p class="text-sm text-gray-500">
                  {{ position.properties.title }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ position.geometry.coordinates.join(", ") }}
                </p>
              </div>
              <div class="whitespace-nowrap text-right text-sm">
                <button
                  type="button"
                  class="rounded-full bg-text p-1 text-gray-500 hover:bg-gray-100"
                  @click="positions.splice(index, 1)"
                >
                  <XMarkIcon class="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { watchEffect } from "vue";
import { MapPinIcon, XMarkIcon } from "@heroicons/vue/24/solid";

const props = defineProps(["positions"]);
const emit = defineEmits(["updatePositions"]);

watchEffect(() => {
  emit("updatePositions", props.positions);
});
</script>
