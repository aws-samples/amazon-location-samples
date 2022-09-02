# Quick Start Web App
This example is a page that takes a user inputted zip code and returns Public Libraries near that location and displays them in an interactive map. 
[MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/), [Amazon Location
Service](https://aws.amazon.com/location), and [AWS Amplify](https://aws.amazon.com/amplify/) are used to build the app.


## Getting started
1. Create Amazon Location resources for the app by following [these steps](https://docs.aws.amazon.com/location/latest/developerguide/getting-started.html#qs-create-resources).
1. Set up authentication for the app by following [these steps](https://docs.aws.amazon.com/location/latest/developerguide/getting-started.html#qs-setup-authentication).
1. Fill replace the values for `identityPoolId`, `mapName`, and `placesName` in [`main.js`](main.js#L5-L10) with the information from steps 1 and 2.
1. Open [quickstart.html](quickstart.html) in a browser to run the app.


## Security

See [CONTRIBUTING](../CONTRIBUTING.md#security-issue-notifications) for more information.


## License

This library is licensed under the MIT-0 License. See the LICENSE file.