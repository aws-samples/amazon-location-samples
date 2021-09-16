# Create a Custom Map Style with Amazon Location Service

UX designers and web developers alike wish to have each component of a website meet the company’s branding requirements while providing a visual impact on its own. Web maps are no exception to this. They provide important visualizations for geographical data. The ability to customize is invaluable when a map is a big part of the user flow and needs to fit in with the rest of the site.

With [Amazon Location Service](https://aws.amazon.com/location/), a managed AWS service for adding location data to applications, you can create a customized web map that will grab the interest of your end users and increase user engagement. At this time Location Service has two data providers, [Esri](https://aws.amazon.com/location/data-providers/esri/) and [HERE](https://aws.amazon.com/location/data-providers/here-technologies/), as well as six default map styles. So, how do you customize these map styles to meet your brand or visual design?

This README will walk you through the process of styling an existing map using [Maputnik](https://maputnik.github.io/) to help visualize the changes in real-time. Others may prefer to use another open source tool called [Fresco](https://fresco.go-spatial.org/), however they are not required to make edits to the style descriptor. In order to style our existing map from Amazon Location Service using these tools we will also demonstrate how to run a local proxy that handles [Signature Version 4 / AWS Authentication](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html).

The following walk through is split into 2 parts:

1) [How to style an existing Map from Amazon Location Service section](##how-to-style-an-existing-map-from-amazon-location-service).
2) [How to integrate a custom map style in a React app](##how-to-integrate-a-custom-map-style-in-a-react-app)

## Prerequisites

1. Install [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) (installed per-user, and invoked per-shell) OR Install [Node.js](https://nodejs.org/en/download/) directly

1. Install the [AWS-CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

1. Install [Amplify](https://docs.amplify.aws/cli/start/install) (Note: If you have a local environment that uses several AWS accounts be sure to use the correct AWS CLI profile and log in to the correct account in the browser)

1. This walk-through uses **"Amplify-Default"** as the AWS CLI profile name and **"us-west-2"** as the AWS Region. Feel free to substitute these values.

## How to style an existing Map from Amazon Location Service

1. Maputnik is an open source visual editor for the [Mapbox Style Specification](https://www.mapbox.com/mapbox-gl-js/style-spec). At the time of writing this editor can be either used in the browser or downloaded as a binary and can run locally. We are going to use the latter option.

1. Go to <https://github.com/maputnik/editor/wiki/Maputnik-CLI> and follow the instructions for installation or optionally from your terminal you can run:

    ```bash

    wget https://github.com/maputnik/editor/releases/download/v1.7.0/maputnik-darwin.zip
    unzip maputnik-darwin.zip
    chmod 755 maputnik
    ```

1. Start up Maputnik

    ```bash

    ./maputnik
    ```

 And open your browser to <http://localhost:8000/#12.44/40.7356/-74.0541>

1. It would be best to start with a clean canvas. Click "Open" in the top navigation bar, then scroll down to the bottom of "Gallery Styles" and selected "Empty Style".

 ![Open](media/MaputnikOpen.png)
 *Open A Style*

 ![Empty](media/MaputnikEmpty.png)
 *Empty Canvas*

1. Tessera is a pluggable [map tile](https://en.wikipedia.org/wiki/Tiled_web_map) server. Using the power of the [tilelive](https://github.com/mapbox/tilelive) ecosystem, it is capable of serving and rendering map tiles from many sources. To stream data from most sources you can install the tilelive providers as npm packages. For an Amazon Location Service source we use tilelive-aws.
1. From your terminal run

    ```bash

    mkdir tileserver
    cd tileserver
    ```

1. We'll need to init a new node project in the current directory

    ```bash

    $ npm init --yes

    Wrote to ... /create-custom-map-style/tileserver/package.json:

    {
      "name": "tileserver",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
      "author": "",
      "license": "ISC"
    }
    ```

1. Next we need to add the Amazon Location Service API as a data source. However, in order to do this we need to use a local proxy that can handle SigV4 (TL;DR a way to provide your AWS credentials with http requests). For this we will use [tessera](https://github.com/mojodna/tessera) and [tilelive-aws](https://github.com/beatleboy501/tilelive-aws). From a new terminal (the `maputnik` process will be occupying the other terminal) run the following:

    ```bash

    nvm use 12
    npm i tessera tilelive-aws
    ```

1. Presuming you have the standard AWS environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`) set correctly, this should be enough to get started using `tessera`. You'll need to provide the full file path to your module, so from your terminal run:

    ```bash

    node_modules/tessera/bin/tessera.js -r $(pwd)/node_modules/tilelive-aws/tilelive-aws.js aws:///<YOUR AMAZON LOCATION SERVICE MAP NAME>
    ```

1. You should see some output in sdtout like `Listening at http://0.0.0.0:8080`.

1. Now go back to Maputnik in your browser and click "Data Sources" in the top navigation bar. There should not be any active data sources. If you see any be sure to delete them.

 ![Data Sources](media/MaputnikDataSources.png)
 *Data Sources*

1. We're going to add a new data source as shown below.

- `Source ID`: `amazon`
- `Source Type`: `Vector (XYZ URLs)`
- `1st Tile URL`: `http://localhost:8080/{z}/{x}/{y}`
- `Min Zoom`: `0`
- `Max Zoom`: `22`

 ![New Data Source](media/MaputnikNewSource.png)
 *New Data Source*

1. In addition to Tiles, the type of web map we will be styling also makes use of **Glyphs** and **Sprites**. We can't use Tessera to proxy the endpoints for these, but we can however use some out of the box endpoints built in to Maputnik. Sprites: `https://maputnik.github.io/osm-liberty/sprites/osm-liberty` and Glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key={key}`)

1. If you want to download a copy of the Sprites and Glyphs your Amazon Location Service Map uses we've included a helper script `downloadSpritesGlyphs.sh` :

    ```bash
    ./downloadSpritesGlyphs.sh <YOUR AMAZON LOCATION SERVICE MAP NAME> <YOUR AWS CLI PROFILE NAME>
    ```
  
This should create a folder for `sprites` and a folder for `glyphs` with a number of options for each. [Sprites](https://docs.aws.amazon.com/cli/latest/reference/location/get-map-sprites.html) can be either `.json` or `.png` files with an optional `@2x` version (Retina quality tile images). [Glyphs](https://docs.aws.amazon.com/cli/latest/reference/location/get-map-glyphs.html) are a combination of a font-family and a Unicode range.

1. We can start with a ready-made style template. Click "Open" in the top navigation bar and under "Upload Style" click "Upload" and select the `example-style-descriptor.json` file included in this repo.

1. This is the style descriptor that is provided by Amazon Location Service as part of your Esri Map. You can download this JSON file by making a signed request to the API endpoint, i.e.

    ```bash

    aws location get-map-style-descriptor --map-name <YOUR AMAZON LOCATION SERVICE MAP NAME> example-style-descriptor.json --profile <YOUR AWS PROFILE NAME>
    ```

1. Because we are proxying our map tiles through a local tileserver we'll need to change one line in the descriptor JSON to point to the correct endpoint. (We'll change it back later).

1. Change Line 7
  From

    ```json

    "tiles": ["https://maps.geo.us-west-2.amazonaws.com/maps/v0/maps/<YOUR AMAZON LOCATION SERVICE MAP NAME>/tiles/{z}/{x}/{y}"],
    ```

    To

    ```json

    "tiles": ["http://localhost:8080/{z}/{x}/{y}"],
    ```

1. If you see an `AccessDenied` error in the `tessera` terminal you may need to manually update the IAM permissions for your role/user add action `geo:GetMapTile` on resource: `arn:aws:geo:<REGION>:<ACCOUNT>:map/<YOUR AMAZON LOCATION SERVICE MAP NAME>`.

1. From the "*View*" dropdown let's select "*Map*"

1. Now we should see a list of layers appear on the left side of the screen

 ![List of Layers](media/MaputnikLayers.png)
 *List of Layers*

1. Let's select the `Building/fill` Layer

 ![Land Not ice](media/MaputnikLandNotIce.png)
 *The Land/Not ice Layer*

1. Scroll down to the JSON Editor section on the left navigation panel

 ![JSON Editor](media/MaputnikJSONEditor.png)
 *The JSON Editor*

1. Note that its fill color is `#f7f6d5`, let's change it to something funky like `#EE84D9`

  ![Layer Before](media/LayerBefore.png)
  *Layer Before*

  ![Layer After](media/LayerAfter.png)
  *Layer After*

1. Now you can see how the map's style has changed a little, you play around some more by clicking on certain areas of the map and seeing which layer it corresponds. Feel free to change colors or outlines

### Map Styling Tips

To help you with your map styling decisions, here are some handy tips:

- Learn the MapLibre style document specification <https://maplibre.org/maplibre-gl-js-docs/style-spec/>
- Learn hexadecimal color values and pick a palette of colors
- Add map accessibility when needed (i.e. color-blind awareness)
- Plan for map markers and choose colors that will contrast
- Use gradients and color transparency for greater detail
- Reserve blue for water layers only
- Ensure legible text values by choosing the best label background and text halo
  
## How to integrate a custom map style in a React app

### Set Up

1. In your terminal create a workspace

    ```bash

    mkdir blog
    cd blog
    ```

1. Clone this repo:

     ```bash
     https://github.com/aws-samples/amazon-location-samples.git
     cd create-custom-map-style
     ```

1. Checkout Node version 12

    ```bash

    nvm install 12
    nvm use 12
    ```

 This allows you to use version 12 locally without setting a specific version globally (although you can install global packages *for that particular* version)

1. Install the application dependencies

    ```bash
    
    npm install
    ```

1. Configure Amplify environment `amplify configure`
 You will be prompted with the following:

    ```bash
 
    Follow these steps to set up access to your AWS account:

    Sign in to your AWS administrator account:
    https://console.aws.amazon.com/
    Press Enter to continue

    Specify the AWS Region
    ? region:  us-west-2
    Specify the username of the new IAM user:
    ? user name:  amplify-xxXXx
    Complete the user creation using the AWS console
    https://console.aws.amazon.com/iam/home?region=us-west-2#/users$new?step=final&accessKey&userNames=amplify-xxXXx&permissionType=policies&policies=arn:aws:iam::aws:policy%2FAdministratorAccess
    Press Enter to continue

    Enter the access key of the newly created user:
    ? accessKeyId:  ********************
    ? secretAccessKey:  ****************************************
    This would update/create the AWS Profile in your local machine
    ? Profile Name:  Amplify-Default

    Successfully set up the new user.
    ```

 NOTE: If you give the Profile Name as `Amplify-Default` as shown above you can substitute it for `<YOUR AWS CLI PROFILE>` in the following steps.

1. Initialize your application `amplify init`

    ```bash

    ? Do you want to use an existing environment? No
    ? Enter a name for the environment <YOUR ENVIRONMENT NAME>
    Using default provider  awscloudformation
    ? Select the authentication method you want to use: AWS profile

    For more information on AWS Profiles, see:
    https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

    ? Please choose the profile you want to use Amplify-Default
    Adding backend environment <YOUR ENVIRONMENT NAME> to AWS Amplify Console app:
    ....
    ```

1. Run `$ amplify status` to see what will be provisioned

    ```bash

    Current Environment: <YOUR ENVIRONMENT NAME>

    | Category | Resource name                | Operation | Provider plugin   |
    | -------- | ---------------------------- | --------- | ----------------- |
    | Hosting  | S3AndCloudFront              | No Change | awscloudformation |
    | Auth     | createcustommapstyle0000000x | No Change | awscloudformation |
    | Geo      | CreateCustomMapStyle         | No Change | awscloudformation |
    ```

1. Push your backend to the cloud `amplify push` - It will create all the resources in the cloud

    ```bash

    ✔ Successfully pulled backend environment <YOUR ENVIRONMENT NAME> from the cloud.
    
    Current Environment: <YOUR ENVIRONMENT NAME>

    | Category | Resource name                | Operation | Provider plugin   |
    | -------- | ---------------------------- | --------- | ----------------- |
    | Hosting  | S3AndCloudFront              | Create    | awscloudformation |
    | Auth     | createcustommapstyle0000000x | Create    | awscloudformation |
    | Geo      | CreateCustomMapStyle         | Create    | awscloudformation |
    
    ? Are you sure you want to continue? Yes
    ⠋ Updating resources in the cloud. This may take a few minutes..
    ```

1. Wait for Cloudformation to provision the necessary resources. Once it's done you should get a message like this:

    ```bash

    ✔ All resources are updated in the cloud
    ```

1. The React App can then be run with `npm start` and the deployed app can be updated with `amplify publish` whenever you like.

1. You can follow the steps in [How to style an existing Map from Amazon Location Service section](##how-to-style-an-existing-map-from-amazon-location-service) to style the map created through Amplify. Once you are satisfied with your edits continue to the [Publishing and Using Your Custom Maputnik Map](###publishing-and-using-your-custom-maputnik-map) section below.

### Publishing and Using Your Custom Maputnik Map

1. On your Maputnik tab in the browser, click "Export" in the top navigation bar
  
1. You should save the file as `example-file-descriptor.json` and place it in your React project's `public/` directory
  
1. Remember to change back Line 7
 From

    ```json

    "tiles": ["http://localhost:8080/{z}/{x}/{y}"],
    ```

    To

    ```json

    "tiles": ["https://maps.geo.us-west-2.amazonaws.com/maps/v0/maps/<YOUR AMAZON LOCATION SERVICE MAP NAME>/tiles/{z}/{x}/{y}"],
    ```

1. We can change the background color of the `.map-container` selector to something like `#EE84D955` to see how the map style changes can be used to match the branding of the rest of a page. In your browser you can now refresh and see the changes you made in Maputnik show up in your own page.
  
   ![Changes Appear](media/ChangesAppear.png)
   *Changes Appear*

### React - Amazon Location Service Integration

1. Now it's time for adding yet another package; this time a very important library that uses WebGL to render interactive maps from [vector tiles](https://docs.mapbox.com/help/glossary/vector-tiles/) and [Maplibre styles](https://maplibre.org/maplibre-gl-js-docs/style-spec/)

    ```bash

    npm install maplibre-gl --save
    ```

1. With this we'll start adding the map to our page. Start by importing the dependencies in your `SamplePage` component

    ```js

    ...
    import maplibregl from 'maplibre-gl';
    ...
    ```

1. Here's where we'll get a chance to fire up our react hooks. We need to add a reference (`useRef`) to the `.demo-map` DOM node, make an asynchronous API call (`useEffect`) to fetch data using Amplify, and keep track of the latitude, longitude, and zoom level of the map (`useState`)

    ```js

    ...
    import  React, { useRef, useState, useEffect } from  'react';
    ...
    import { createMap } from "maplibre-gl-js-amplify";
    import style from './example-style-descriptor.json';
    ...
    const SamplePage = () => {
      const map = useRef();

      const [coordinates, setCoordinates] = useState({
        lat: 40.7356,
        lng: -74.0541,
        zoom: 12.44,
      });

      useEffect(async () => {
        const { lat, lng, zoom } = coordinates;
        const demoMap = await createMap({
          container: map.current,
          center: [lng, lat],
          zoom,
          style,
        });
        demoMap.on('move', () => {
          setCoordinates({
            lng: demoMap.getCenter().lng.toFixed(4),
            lat: demoMap.getCenter().lat.toFixed(4),
            zoom: demoMap.getZoom().toFixed(2),
          });
        });
        return () => demoMap.remove();
      }, []);
    ...

    // And in your return statement below change
    // <div className="demo-map" />
    // to

    <div ref={map} className="demo-map" />
    ```

1. `maplibre-gl-js-amplify` takes care of authenticating our user before calling Location Service when fetching the map tiles.

1. You should be able to go back to your browser now and see the base map style show up inside your `demo-map` div

 ![Esri Streets Base Map](media/BaseMap.png)
 *Esri Streets Base Map*

## Clean Up

To avoid incurring future charges, delete the resources used in this tutorial. Here is a checklist to help:



## Conclusion

Using Amazon Location Service with other AWS Services and open source tools such as Maputnik and MapLibre, you can create a fully customizable Map style specially when maps is an integral part of your application and you want to give your map a personalized touch. Now, if you have an idea about how you can achieve the map customization, you can also try it with [Fresco](https://fresco.gospatial.org/), MapBox Studio, and other open source tools for editing.
