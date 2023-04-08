<template>
  <div class="relative mt-6 mb-4">
    <div class="absolute inset-0 flex items-center" aria-hidden="true">
      <div class="w-full border-t border-gray-300" />
    </div>
    <div class="relative flex justify-center">
      <span class="bg-white px-2 text-sm text-gray-500">Options</span>
    </div>
  </div>
  <div class="sm:block">
    <nav class="flex space-x-2" aria-label="Tabs">
      <a
        v-for="option in options"
        :key="option"
        :class="[
          'cursor-pointer',
          option === selectedOption
            ? 'bg-blue-600 text-white hover:bg-blue-500'
            : 'ring-1 ring-inset ring-gray-300 bg-white text-gray-600 hover:bg-gray-50',
          'flex items-center justify-center rounded-md py-2 px-2 text-xs font-medium uppercase sm:flex-1',
        ]"
        @click.stop="selectedOption = option"
        >{{ option }}</a
      >
    </nav>

    <!-- Unit of measurement options -->
    <div v-if="selectedOption === 'Unit'">
      <fieldset class="mt-4">
        <div class="space-y-2">
          <div v-for="unit in units" :key="unit.name" class="flex items-center">
            <input
              :id="unit.name"
              name="unit-of-measurement"
              type="radio"
              :value="unit"
              class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
              v-model="selectedUnit"
            />
            <label
              :for="unit.name"
              class="ml-3 block text-sm leading-6 text-gray-900"
              >{{ unit.name }}</label
            >
          </div>
        </div>
      </fieldset>
    </div>

    <!-- Departure time options -->
    <div v-if="selectedOption === 'Departure'">
      <fieldset class="mt-4">
        <div class="space-y-2">
          <div
            v-for="departureTime in departureTimes"
            :key="departureTime"
            class="flex items-center"
          >
            <input
              :id="departureTime"
              name="departure-time"
              type="radio"
              :value="departureTime"
              class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
              v-model="selectedDepartureTime"
            />
            <label
              :for="departureTime"
              class="ml-3 block text-sm leading-6 text-gray-900"
              >{{ departureTime }}</label
            >
          </div>
        </div>
      </fieldset>
    </div>

    <!-- Avoid options -->
    <div v-if="selectedOption === 'Avoidance'">
      <fieldset class="mt-4">
        <div class="space-y-2">
          <div
            v-for="avoidance in avoidances"
            :key="avoidance"
            class="flex items-center"
          >
            <input
              :id="avoidance"
              name="avoidances"
              type="checkbox"
              :value="avoidance"
              class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
              v-model="selectedAvoidance"
            />
            <label
              :for="avoidance"
              class="ml-3 block text-sm leading-6 text-gray-900"
              >{{ avoidance }}</label
            >
          </div>
        </div>
      </fieldset>
    </div>

    <!-- Truck options -->
    <div v-if="selectedOption === 'Truck'">
      <div class="space-y-4 mt-4">
        <div class="flex max-w-lg rounded-md shadow-sm">
          <input
            type="text"
            name="height"
            id="height"
            placeholder="Height"
            v-model="truckHeight"
            class="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          <span
            class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm"
            >{{ selectedUnit.options.truck.dimension }}</span
          >
        </div>
        <div class="flex max-w-lg rounded-md shadow-sm">
          <input
            type="text"
            name="width"
            id="width"
            v-model="truckWidth"
            placeholder="Width"
            class="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          <span
            class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm"
            >{{ selectedUnit.options.truck.dimension }}</span
          >
        </div>
        <div class="flex max-w-lg rounded-md shadow-sm">
          <input
            type="text"
            name="length"
            id="length"
            v-model="truckLength"
            placeholder="Length"
            class="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          <span
            class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm"
            >{{ selectedUnit.options.truck.dimension }}</span
          >
        </div>
        <div class="flex max-w-lg rounded-md shadow-sm">
          <input
            type="text"
            name="weight"
            id="weight"
            v-model="truckWeight"
            placeholder="Weight"
            class="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          <span
            class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm"
            >{{ selectedUnit.options.truck.weight }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted } from "vue";

const emit = defineEmits(["updateParameters"]);

const options = ref(["Unit", "Departure", "Avoidance", "Truck"]);
const selectedOption = ref(options.value[0]);

const units = ref([
  {
    name: "Metric",
    options: {
      route: { distance: "Kilometers" },
      truck: { dimension: "Meters", weight: "Kilograms" },
    },
  },
  {
    name: "Imperial",
    options: {
      route: { distance: "Miles" },
      truck: { dimension: "Feet", weight: "Pounds" },
    },
  },
]);
const selectedUnit = ref(units.value[0]);

const departureTimes = ref(["Optimal traffic conditions", "Now"]);
const selectedDepartureTime = ref(departureTimes.value[0]);

const avoidances = ref(["Tolls", "Ferries"]);
const selectedAvoidance = ref([]);

const truckHeight = ref(null);
const truckWidth = ref(null);
const truckLength = ref(null);
const truckWeight = ref(null);

onMounted(() => {});

watchEffect(() => {
  emit("updateParameters", {
    option: selectedOption.value,
    unit: selectedUnit.value,
    departureTime: selectedDepartureTime.value,
    avoidance: selectedAvoidance.value,
    truck: {
      height: truckHeight.value,
      width: truckWidth.value,
      length: truckLength.value,
      weight: truckWeight.value,
    },
  });
});
</script>
