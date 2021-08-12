# Amazon Location Helpers

`amazon-location-helpers` helps initialize [MapLibre GL JS](https://maplibre.org/) maps for use with [Amazon Location Service](https://aws.amazon.com/location). Given an [Amazon Cognito Identity Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html) ID (or provided an AWS `Credentials` object) and the name of a [Map resource](https://docs.aws.amazon.com/location-maps/latest/APIReference/API_CreateMap.html), this will fetch AWS credentials and initialize a [`Map`](https://maplibre.org/maplibre-gl-js-docs/api/map/) instance, configured to sign requests with [Signature Version 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html).

See [Allowing unauthenticated guest access to your application using Amazon Cognito](https://docs.aws.amazon.com/location/latest/developerguide/authenticating-using-cognito.html) for instructions on how to create an Identity Pool. The Identity Pool ID will be used below.

## Installation

`amazon-location-helpers` can be installed from npm for use with apps that include a build step:

```bash
npm install amazon-location-helpers
```

`amazon-location-helpers` can also be used in static HTML documents. For full functionality, [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/), [the AWS SDK for JavaScript](https://github.com/aws/aws-sdk-js), and [AWS Amplify Core](https://github.com/aws-amplify/amplify-js) must be loaded:

```html
<html>
  <head>
    <link
      href="https://unpkg.com/maplibre-gl@1/dist/maplibre-gl.css"
      rel="stylesheet"
    />
  </head>

  <body>
    <div id="map" style="height: 100vh" />
    <script src="https://unpkg.com/maplibre-gl@1"></script>
    <script src="https://unpkg.com/amazon-location-helpers@1"></script>
    <script>
      AmazonLocation.createMap(
        {
          "us-east-1:54f2ba88-9390-498d-aaa5-0d97fb7ca3bd",
        },
        {
          container: "map",
          center: [-123.1187, 49.2819], // initial map centerpoint
          zoom: 10, // initial map zoom
          style: "explore.map,
          hash: true,
        }
      );
    </script>
  </body>
</html>
```

## API

### `createMap`

```typescript
function createMap(
  config: {
    credentials?: Credentials;
    identityPoolId?: string;
    region?: string;
  },
  options: mapboxgl.MapboxOptions,
  mapgl?: typeof mapboxgl
): Promise<mapboxgl.Map>;
```

This will instantiate a [`Map`](https://maplibre.org/maplibre-gl-js-docs/api/map/), exchange the provided Amazon Cognito Identity Pool ID for AWS credentials, load the style associated with the `explore.map` Map resource, and render it to the `<div>` identified as `map`, centered on Vancouver, British Columbia:

```javascript
const map = await AmazonLocation.createMap(
  "us-east-1:54f2ba88-9390-498d-aaa5-0d97fb7ca3bd",
  {
    container: "map",
    center: [-123.1187, 49.2819], // initial map centerpoint
    zoom: 10, // initial map zoom
    style: "explore.map",
  }
);
```

For a fully worked example, see [`maplibre-gl-js/index.html`](https://github.com/aws-samples/amazon-location-samples/blob/main/maplibre-gl-js/index.html).

### `createRequestTransformer`

```typescript
function createRequestTransformer(config: {
  credentials?: Credentials;
  identityPoolId?: string;
  region?: string;
}): Promise<mapboxgl.TransformRequestFunction>;
```

This will initialize a `transformRequest` function suitable for providing to [`Map`](https://maplibre.org/maplibre-gl-js-docs/api/map/)'s `transformRequest` property that will intercept requests made by MapLibre GL JS to AWS and sign them using [Signature Version 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html):

```javascript
import { createRequestTransformer } from "amazon-location-helpers";

const transformRequest = await createRequestTransformer({
  identityPoolId: "us-east-1:54f2ba88-9390-498d-aaa5-0d97fb7ca3bd",
});
```

This can then be used with [`react-map-gl`](https://visgl.github.io/react-map-gl/):

```javascript
// React equivalent to the above example
<ReactMapGL
  latitude={49.2819}
  longitude={-123.1187}
  zoom={10}
  width="100%"
  height="100vh"
  transformRequest={transformRequest}
  mapStyle="explore.map"
/>
```

For a fully worked example, see [`maplibre-gl-js-react/src/index.tsx`](https://github.com/aws-samples/amazon-location-samples/blob/main/maplibre-gl-js-react/src/index.tsx).

### `getCredentialsForIdentityPool`

```typescript

function getCredentialsForIdentityPool(
  identity: string
): Promise<Credentials>;
```

This will exchange an Amazon Cognito Identity Pool ID for temporary AWS credentials. For example:

```javascript
const credentials = await AmazonLocation.getCredentialsForIdentityPool("us-east-1:54f2ba88-9390-498d-aaa5-0d97fb7ca3bd");

// use credentials with other AWS services
```

## Security

See [CONTRIBUTING](https://github.com/aws-samples/amazon-location-samples/blog/main/CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
