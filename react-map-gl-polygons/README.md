# Visualize Data Polygons Sample
This sample app demonstrates using Amazon Location Service to display a polygon on an interactive map. The borders of Vancouver, BC, Canada are loaded from geoJSON and displayed on a map as a polygon. The sample app uses [`react-map-gl`](https://visgl.github.io/react-map-gl/) with
[MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/), [Amazon Location
Service](https://aws.amazon.com/location), and [AWS Amplify](https://aws.amazon.com/amplify/).


## Implementation

See [`src/index.js`](src/index.js).

## Dependencies
[`react-map-gl`](https://visgl.github.io/react-map-gl/): React components used to display maps.

[`maplibre-gl-js`](https://github.com/maplibre/maplibre-gl-js): Used to draw Amazon Location Service provided maps.

[`aws-amplify`](https://github.com/aws-amplify/amplify-js): Helps with authentication to get map resources from Amazon Location Service.

[`maplibre-gl-js-amplify`](https://github.com/aws-amplify/maplibre-gl-js-amplify): Used to get map resources from Amazon Location Service using aws-amplify.

See more in [`package.json`](package.json)

App has been tested on Node.js v16.13.2 and NPM v8.1.2


## Getting started
1. Install [`Node.js`](https://nodejs.org)
1. Set up map resources for Amazon Location Service by following [`this guide`](https://docs.aws.amazon.com/location/latest/developerguide/using-maps.html).
1. Create an Amazon Cognito identity pool by following [`this guide`](https://docs.aws.amazon.com/location/latest/developerguide/authenticating-using-cognito.html). 
1. Install project dependencies: run `npm install` from the sample app location on your computer.
1. Fill in required fields for Amazon Cognito and Amazon Location Service in [`src/configuration.js`](src/configuration.js).
1. Start the app: run `npm start` from the sample app location on your computer.



## Important notes

This project uses [aliasing in webpack](https://webpack.js.org/configuration/resolve/#resolvealias) to alias `react-map-gl`'s Mapbox GL dependency to [MapLibre GL JS](https://maplibre.org/), as `react-map-gl` depends on `mapbox-gl@^2` by default, which is **NOT** compatible with Amazon Location Service, as it requires a Mapbox API key. See the [`react-map-gl guide`](https://visgl.github.io/react-map-gl/docs/get-started/get-started#using-with-a-mapbox-gl-fork) and [`webpack.config.js`](webpack.config.js#L21-L24) to see how the aliasing works.

## Security

See [CONTRIBUTING](../CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
