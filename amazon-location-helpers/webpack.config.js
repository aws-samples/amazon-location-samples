// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

module.exports = {
  entry: {
    "amazon-location.min": "./index.js",
  },
  externals: [
    {
      "mapbox-gl": {
        commonjs: "mapbox-gl",
        commonjs2: "mapbox-gl",
        root: "mapboxgl",
        amd: "mapbox-gl",
      },
      "maplibre-gl": {
        commonjs: "maplibre-gl",
        commonjs2: "maplibre-gl",
        root: "maplibregl",
        amd: "maplibre-gl",
      },
    },
  ],
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
    library: {
      name: "AmazonLocation",
      type: "umd",
      umdNamedDefine: true,
    },
    globalObject: "this",
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  mode: "production",
};
