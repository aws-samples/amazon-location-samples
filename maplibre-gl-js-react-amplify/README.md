# Using MapLibre GL JS with Amazon Location Service and AWS Amplify in a React application

This example demonstrates how to use [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/)
with [Amazon Location Service](https://aws.amazon.com/location) and [AWS
Amplify](https://aws.amazon.com/amplify/) within a React application.

[`react-map-gl`](https://visgl.github.io/react-map-gl/) is a set of React components that can be
used to display maps. [`react-map-gl-amplify`](../react-map-gl-amplify/) demonstrates how to use
`react-map-gl` with Amazon Location and AWS Amplify.

## Implementation

See [`src/index.tsx`](src/index.tsx).

## Dependencies

See [`package.json`](package.json#L6-L12).

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

## Security

See [CONTRIBUTING](../CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
