// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

module.exports = {
  entry: {
    "amazon-location.min": "./index.js",
  },
  externals: [
    {
      "@aws-amplify/core": {
        commonjs: "@aws-amplify/core",
        commonjs2: "@aws-amplify/core",
        root: "aws_amplify_core",
        amd: "@aws-amplify/core/dist/aws-amplify-core.min.js",
      },
      "aws-sdk": {
        commonjs: "aws-sdk",
        commonjs2: "aws-sdk",
        root: "AWS",
        amd: "aws-sdk",
      },
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
