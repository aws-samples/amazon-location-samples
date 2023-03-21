<template>
  <RadioGroup v-model="selectedTravelMode">
    <div class="grid grid-cols-3 gap-3">
      <RadioGroupOption
        as="template"
        v-for="mode in travelModes"
        :key="mode"
        :value="mode"
        v-slot="{ checked }"
      >
        <div
          :class="[
            'cursor-pointer focus:outline-none',
            checked
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'ring-1 ring-inset ring-gray-300 bg-white text-gray-600 hover:bg-gray-50',
            'flex items-center justify-center rounded-md py-2 px-2 text-sm font-semibold uppercase sm:flex-1',
          ]"
        >
          <RadioGroupLabel as="span">{{ mode }}</RadioGroupLabel>
        </div>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";

const emit = defineEmits(["updateTravelMode"]);

const travelModes = ["Truck", "Car", "Walking"];
const selectedTravelMode = ref(travelModes[0]);

watchEffect(() => {
  emit("updateTravelMode", selectedTravelMode.value);
});
</script>
