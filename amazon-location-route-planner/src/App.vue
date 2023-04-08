<template>
  <div id="map"></div>
  <div
    class="absolute left-2 top-2 border-gray-200 rounded bg-white max-w-sm px-6 py-6 shadow-md"
  >
    <!-- Travel mode options -->
    <TravelMode @updateTravelMode="updateTravelMode"></TravelMode>

    <!-- Route summary -->
    <p class="mt-8 mb-4 text-sm">
      Click on the map to choose your starting point and destination(s).
    </p>
    <RouteSummary
      v-if="route.features.length > 0"
      :properties="route.features[0].properties"
    ></RouteSummary>

    <!-- Position feed -->
    <PositionFeed
      :positions="positions.features"
      @update-positions="(newPositions) => (positions.features = newPositions)"
    ></PositionFeed>

    <!-- Parameters -->
    <Parameters @update-parameters="updateParameters"></Parameters>
  </div>
</template>

<script setup>
import { ref, watch, computed, reactive } from "vue";
import { CalculateRouteCommand } from "@aws-sdk/client-location";
import maplibregl from "maplibre-gl";
import { point, lineString, featureCollection } from "@turf/helpers";
import { locationClient, refreshCredentials, transformRequest } from "./auth";
import TravelMode from "./components/TravelMode.vue";
import RouteSummary from "./components/RouteSummary.vue";
import PositionFeed from "./components/PositionFeed.vue";
import Parameters from "./components/Parameters.vue";
import { mapName, routeCalculatorName } from "./config";

//  Variables ////////////////////////////////////////////////////////////////////////////////
let map = null;

const travelMode = ref(null);

const positions = reactive(featureCollection([]));
const route = reactive(featureCollection([]));

const parameters = reactive({
  unit: null,
  departureTime: null,
  avoidance: null,
  truck: {
    height: null,
    width: null,
    length: null,
    weight: null,
  },
});

const updateTravelMode = (mode) => {
  travelMode.value = mode;
};

const updateParameters = (params) => {
  parameters.unit = params.unit;
  parameters.departureTime = params.departureTime;
  parameters.avoidance = params.avoidance;
  parameters.truck.height = params.truck.height;
  parameters.truck.width = params.truck.width;
  parameters.truck.length = params.truck.length;
  parameters.truck.weight = params.truck.weight;
};

// Build API request body (computed properties) ///////////////////////////////////////////////////
const requestParams = computed(() => {
  const params = {
    CalculatorName: routeCalculatorName,
    TravelMode: travelMode.value,
    DistanceUnit: parameters.unit.options.route.distance,
    IncludeLegGeometry: true,
  };

  // Positions (DeparturePosition, WaypointPositions, and DestinationPosition)
  if (positions.features.length > 1) {
    params.DeparturePosition = positions.features[0].geometry.coordinates;

    params.DestinationPosition =
      positions.features[positions.features.length - 1].geometry.coordinates;

    params.WaypointPositions = positions.features
      .slice(1, positions.features.length - 1)
      .map((feature) => feature.geometry.coordinates);
  }

  // DepartureTimeOptions
  if (parameters.departureTime === "Optimal traffic conditions") {
    delete params.DepartNow;
    delete params.DepartureTime;
  }

  if (parameters.departureTime === "Now") {
    delete params.DepartureTime;
    params.DepartNow = true;
  }

  // CarModeOptions
  if (travelMode.value === "Car") {
    params.CarModeOptions = {
      ...params.CarModeOptions,
      AvoidFerries: parameters.avoidance.includes("Ferries"),
      AvoidTolls: parameters.avoidance.includes("Tolls"),
    };
  }

  // TruckModeOptions
  if (travelMode.value === "Truck") {
    params.TruckModeOptions = {
      ...params.TruckModeOptions,
      AvoidFerries: parameters.avoidance.includes("Ferries"),
      AvoidTolls: parameters.avoidance.includes("Tolls"),
    };

    if (
      parameters.truck.height != null ||
      parameters.truck.length != null ||
      parameters.truck.width != null
    ) {
      params.TruckModeOptions.Dimensions = {
        Height: parameters.truck.height,
        Length: parameters.truck.length,
        Width: parameters.truck.width,
        Unit: parameters.unit.options.truck.dimension,
      };
    }

    if (parameters.truck.weight != null) {
      params.TruckModeOptions.Weight = {
        Total: parameters.truck.weight,
        Unit: parameters.unit.options.truck.weight,
      };
    }
  }

  return params;
});

// Watchers, keeping track of changes in routing parameters ///////////////////////////////////////
watch(route, (value) => {
  map.getSource("route").setData(value);
});

watch(travelMode, async () => {
  await calculateRoute();
});

watch(positions, async (value) => {
  if (positions.features.length < 2) {
    route.features.length = 0;
  }
  map.getSource("positions").setData(value);
  map.getSource("positions-label").setData(value);
  await calculateRoute();
});

watch(
  () => parameters.unit,
  async () => {
    await calculateRoute();
  }
);

watch(
  () => parameters.departureTime,
  async () => {
    await calculateRoute();
  }
);

watch(
  () => parameters.avoidance,
  async () => {
    await calculateRoute();
  }
);

watch(
  () => parameters.truck.height,
  async (value) => {
    if (value === "") {
      parameters.truck.height = null;
    }
    await calculateRoute();
  }
);

watch(
  () => parameters.truck.width,
  async (value) => {
    if (value === "") {
      parameters.truck.width = null;
    }
    await calculateRoute();
  }
);

watch(
  () => parameters.truck.length,
  async (value) => {
    if (value === "") {
      parameters.truck.length = null;
    }
    await calculateRoute();
  }
);

watch(
  () => parameters.truck.weight,
  async (value) => {
    if (value === "") {
      parameters.truck.weight = null;
    }
    await calculateRoute();
  }
);

// Initialize app /////////////////////////////////////////////////////////////////////////////////
const initializeApp = async () => {
  // Refresh auth credentials
  await refreshCredentials();

  // Initialize a new map instance
  map = new maplibregl.Map({
    container: "map",
    center: [-114.067375, 51.046333],
    zoom: 16,
    style: mapName,
    hash: true,
    transformRequest,
  });

  // Add navigation controls for the map
  map.addControl(new maplibregl.NavigationControl(), "bottom-right");

  map.on("load", () => {
    // Add a layer for rendering departure, waypoint, and destination positions on the map
    map.addLayer({
      id: "positions",
      type: "circle",
      source: { type: "geojson", data: positions },
      paint: {
        "circle-radius": 5,
        "circle-color": "#ffffff",
        "circle-stroke-color": "#000",
        "circle-stroke-width": 3,
      },
    });

    // Add a layer for rendering position labels on the map
    map.addLayer({
      id: "positions-label",
      type: "symbol",
      source: { type: "geojson", data: positions },
      layout: {
        "text-field": ["get", "title"],
        "text-variable-anchor": ["left"],
        "text-radial-offset": 0.5,
        "text-justify": "auto",
        "text-font": ["Fira GO Regular"],
      },
    });

    // Add a layer for rendering routes on the map
    map.addLayer(
      {
        id: "route",
        type: "line",
        source: { type: "geojson", data: route },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#000",
          "line-width": 5,
          "line-opacity": 1,
        },
      },
      "positions"
    );
  });

  // Add an event handler to capture departure, waypoint, and destination positions
  let counter = 0;
  map.on("click", async (e) => {
    counter++;
    const { lngLat } = e;
    const p = point([lngLat.lng.toFixed(5), lngLat.lat.toFixed(5)], {
      title: `Point ${counter}`,
    });
    positions.features.push(p);
  });
};

// Calculate route
const calculateRoute = async () => {
  if (
    requestParams.value.DeparturePosition &&
    requestParams.value.DestinationPosition
  ) {
    const command = new CalculateRouteCommand(requestParams.value);
    const response = await locationClient.send(command);
    const routeFeature = lineString(
      response.Legs.flatMap((leg) => leg.Geometry.LineString),
      response.Summary
    );
    route.features.length = 0;
    route.features.push(routeFeature);
  }
};

initializeApp();
</script>
<style>
body {
  margin: 0;
  padding: 0;
}
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0px;
  width: 100%;
}
</style>
