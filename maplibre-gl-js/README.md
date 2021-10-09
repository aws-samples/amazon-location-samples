# How to use MapLibre GL JS with Amazon Location Service

This example demonstrates how to use [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/)
with [Amazon Location Service](https://aws.amazon.com/location) using the
[`amazon-location-helpers`](https://www.npmjs.com/package/amazon-location-helpers) library.

## Configuration

Within `index.html`, replace [`<Identity Pool ID>`](index.html#L21) with an [Amazon Cognito identity
pool ID granted access to Amazon Location
Maps](https://docs.aws.amazon.com/location/latest/developerguide/authenticating-using-cognito.html).
Next, replace [`<Map name>`](index.html#L28) with the name of a Map resource that you'd previously
created.

To change the map's viewport, [modify `center` and `zoom` within `createMap`'s MapLibre constructor
options](index.html#L23-L30).

## Security

See [CONTRIBUTING](../CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
