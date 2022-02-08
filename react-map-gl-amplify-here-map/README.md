# Amazon Location Service and HERE Technologies

Demo created for demonstrations purposes for [re:Invent 2021](https://reinvent.awsevents.com/).

Within this solution, you will learn how to leverage the capabilities provided by [HERE Technologies](https://aws.amazon.com/location/data-providers/here-technologies/) via [Amazon Location Service](https://aws.amazon.com/location) to build your own location-based solutions. The features covered are:

### Maps

Maps help you visualize location information and are the foundations of many location-based service capabilities. Amazon Location Service provides map tiles of different styles sourced from HERE. The map tiles from HERE are trusted by millions of customers worldwide, and have been continuously fine-tuned over the decades for a wide range of customer applications.

### Places

Amazon Location Service Places enables your application to offer point-of-interest search functionality, convert addresses into geographic coordinates in latitude and longitude (geocoding), and convert a coordinate into a street address (reverse geocoding). Amazon Location Service sources high-quality geospatial data from HERE, so you can use them to improve the quality and the versatility of your address database.

### Routes

With Amazon Location Routes, your application can request the travel time, distance, and directions between a departure point and one or more destinations, with specific travel restrictions such as Truck mode, vehicle dimension, and avoidances. Amazon Location Service provides routing data sourced from HERE. This enables your application to obtain accurate estimates of travel time based on up-to-date roadway information and live traffic information. Amazon Location Service Routes can help you achieve business goals such as faster delivery and reduced fuel consumption.

### Amplify Geo

Amplify Geo provides APIs and map UI components for maps and location search for JavaScript-based web apps. You can add maps and location search functionality to your app in just a few lines of code. Amplify Geo APIs are powered by Amazon Location Service and HERE TEchnologies, having the map UI components from MapLibre already integrated with the Geo APIs. You can quickly get started using [Amplify CLI](https://docs.amplify.aws/cli/geo/maps/) to provision your map and location search resources.

### Learn More

To learn more check out [this blog post on the HERE Developer Blog](https://developer.here.com/blog/build-and-deploy-location-apps-with-aws-location-services-and-here).

## Implementation

The demo uses [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/) and [AWS Amplify](https://aws.amazon.com/amplify/) within a React application.

[`react-map-gl`](https://visgl.github.io/react-map-gl/) is a set of React components that can be
used to display maps. [`react-map-gl-amplify`](../react-map-gl-amplify/) demonstrates how to use
`react-map-gl` with Amazon Location and AWS Amplify. The demo also uses [@aws-amplify/ui-react](https://ui.docs.amplify.aws/getting-started/installation) to build part of the UI.

See [`src/index.js`](src/index.js).

## Dependencies

See [`package.json`](package.json#L6-L22).

## Getting started

To deploy clone this repo and run:

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
