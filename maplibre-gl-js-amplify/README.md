# How to use MapLibre GL JS with Amazon Location Service and AWS Amplify

This example demonstrates how to use [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/)
with [Amazon Location Service](https://aws.amazon.com/location) and [AWS
Amplify](https://aws.amazon.com/amplify/).

## Configuration

Within `index.html`, replace [`<identity pool ID>`](index.html#L28) with an [Amazon Cognito identity
pool ID granted access to Amazon Location
Maps](https://docs.aws.amazon.com/location/latest/developerguide/authenticating-using-cognito.html).
Replace [`<region>`](index.html#L29) with the AWS Region hosting the identity pool and Map source.
Finally, replace [`<map name>`](index.html#L30) with the name of a Map resource that you'd
previously created.

To change the map's viewport, [modify `center` and `zoom` within the `createMap`
options](index.html#L53-L60).

## Security

See [CONTRIBUTING](../CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
