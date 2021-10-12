# Using react-map-gl with Amazon Location Service and AWS Amplify

This example demonstrates how to use [`react-map-gl`](https://visgl.github.io/react-map-gl/) with
[MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/), [Amazon Location
Service](https://aws.amazon.com/location), and [AWS Amplify](https://aws.amazon.com/amplify/).

## Implementation

See [`src/index.tsx`](src/index.tsx).

## Dependencies

See [`package.json`](package.json#L6-L14).

## Getting started

1. Install the Amplify CLI: `npm install -g @aws-amplify/cli`
1. Install project dependencies: `npm install`
1. Create a new Amplify project environment: `amplify init`
1. Create Auth and Geo resources: `amplify push`

## Cleaning up

To clean up all resources created for this application, run the following:

```bash
amplify delete
```

## Important notes

This project uses [CRACO](https://github.com/gsoft-inc/craco) to alias `react-map-gl`'s Mapbox GL
dependency to [MapLibre GL JS](https://maplibre.org/), as `react-map-gl` depends on `mapbox-gl@^2`
by default, which is **NOT** compatible with Amazon Location Service, as it requires a Mapbox API
key. See [`craco.config.js`](craco.config.js) to see how the aliasing works.

## Security

See [CONTRIBUTING](../CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
