// CRACO is being used to alias react-map-gl's Mapbox GL dependency to MapLibre GL JS, as 
// react-map-gl depends on mapbox-gl@^2 by default, which is NOT compatible with Amazon Location 
// Service, as it requires a Mapbox API key.
// https://visgl.github.io/react-map-gl/docs/get-started/get-started#using-with-a-mapbox-gl-fork

module.exports = {
  webpack: {
    alias: {
      "mapbox-gl": "maplibre-gl"
    }
  }
}
