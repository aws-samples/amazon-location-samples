# Amazon Location Service Example - React.js

## Getting started

1. Install dependencies using `npm install`

2. Follow steps to [create an Amplify project and enable Amazon Location Service permissions](https://docs.amplify.aws/guides/location-service/setting-up-your-app/q/platform/js#connecting-your-react-app-to-the-amazon-location-service)

3. Create a map in the [Amazon Location Service console](https://console.aws.amazon.com/location/maps/home?region=us-east-1#/) and replace `<MAP_NAME>` with the name of the one you created in `src/index.tsx` on line 22.

4. Start the app using `npm start`

## Important notes

- The `<head>` element in `public/index.html` contains a style sheet for Mapbox GL. Don't forget to add this when adding to an existing app.

- `mapbox-gl@^2` and `react-map-gl@^6` are **NOT** compatible with Amazon Location Service, as they require a Mapbox API key. This project pins these package versions to ^1.0.0 and ^5.0.0, respectively.
