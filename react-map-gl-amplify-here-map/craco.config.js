module.exports = {
  webpack: {
    alias: {
      "mapbox-gl": "maplibre-gl",
    },
  },
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
