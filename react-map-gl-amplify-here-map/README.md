# Amazon Location Service and HERE Technologies

This demo demonstrates how to use location data [provided by HERE Technologies](https://aws.amazon.com/location/data-providers/here-technologies/) via [Amazon Location Service](https://aws.amazon.com/location). The demo uses [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/) and [AWS Amplify](https://aws.amazon.com/amplify/) within a React application.

[`react-map-gl`](https://visgl.github.io/react-map-gl/) is a set of React components that can be
used to display maps. [`react-map-gl-amplify`](../react-map-gl-amplify/) demonstrates how to use
`react-map-gl` with Amazon Location and AWS Amplify. The demo also uses [react-aria](https://react-spectrum.adobe.com/react-aria/index.html) to build part of the UI and [tailwindcss](https://github.com/tailwindlabs/tailwindcss) for styling.

## Implementation

See [`src/index.js`](src/index.js).

## Dependencies

See [`package.json`](package.json#L6-L22).

## Getting started

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/aws-samples/amazon-location-samples/tree/main/react-map-gl-amplify-here-map)

Or alternatively, to deploy manually, clone this repo and run:

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
