<template>
  <div class="flex flex-row text-xl font-bold">
    <div>
      {{ Math.round(properties.DurationSeconds / 60) }}
      Minutes
    </div>
    <div class="mx-1">
      ({{ properties.Distance.toFixed(1) }} {{ properties.DistanceUnit }})
    </div>
  </div>
</template>

<script setup>
defineProps(["properties"]);
</script>
