# Visualize Data Clusters Sample
This sample app demonstrates using Amazon Location Service to display clustered points on an interactive map. Historical earthquake data is loaded as static data, and viewed as points that automatically group into clusters when they overlap. The sample uses [`react-map-gl`](https://visgl.github.io/react-map-gl/) with
[MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/), [Amazon Location
Service](https://aws.amazon.com/location), and [AWS Amplify](https://aws.amazon.com/amplify/). Zoom in to see individual points and out to see clustered points.


## Implementation

See [`src/index.js`](src/index.js).

## Dependencies
[`react-map-gl`](https://visgl.github.io/react-map-gl/): React components used to display maps.

[`CRACO`](https://github.com/gsoft-inc/craco): Used to alias react-map-gl’s dependency  [`mapbox-gl`](https://github.com/mapbox/mapbox-gl-js) to [`maplibre-gl`](https://github.com/maplibre/maplibre-gl-js) so it can be compatible with Amazon Location Service.

[`maplibre-gl-js`](https://github.com/maplibre/maplibre-gl-js): Used to draw Amazon Location Service provided maps.

[`aws-amplify`](https://github.com/aws-amplify/amplify-js): Helps with authentication to get map resources from Amazon Location Service.

[`maplibre-gl-js-amplify`](https://github.com/aws-amplify/maplibre-gl-js-amplify): Used to get map resources from Amazon Location Service using aws-amplify.

See more in [`package.json`](package.json#L6-L14)

App has been tested on Node.js v16.13.2 and NPM v8.1.2


## Getting started
1. Install [`Node.js`](https://nodejs.org)
1. Set up map resources for Amazon Location Service by following [`this guide`](https://docs.aws.amazon.com/location/latest/developerguide/using-maps.html).
1. Create an Amazon Cognito identity pool by following [`this guide`](https://docs.aws.amazon.com/location/latest/developerguide/authenticating-using-cognito.html). 
1. Install project dependencies: run `npm install` from the sample app location on your computer.
1. Fill in required fields for Amazon Cognito and Amazon Location Service in [`src/configuration.js`](src/configuration.js).
1. Start the app: run `npm start` from the sample app location on your computer.



## Important notes

This project uses [CRACO](https://github.com/gsoft-inc/craco) to alias `react-map-gl`'s Mapbox GL
dependency to [MapLibre GL JS](https://maplibre.org/), as `react-map-gl` depends on `mapbox-gl@^2`
by default, which is **NOT** compatible with Amazon Location Service, as it requires a Mapbox API
key. See [`craco.config.js`](craco.config.js) to see how the aliasing works.

## Security

See [CONTRIBUTING](../CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
