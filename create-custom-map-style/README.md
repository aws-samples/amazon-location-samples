# Create a Custom Map Style with Amazon Location Service

UX designers and web developers alike wish to have each component of a website meet the company’s branding requirements while providing a visual impact on its own. Web maps are no exception to this. They provide important visualizations for geographical data. The ability to customize is invaluable when a map is a big part of the user flow and needs to fit in with the rest of the site.

With [Amazon Location Service](https://aws.amazon.com/location/), a managed AWS service for adding location data to applications, you can create a customized web map that will grab the interest of your end users and increase user engagement. At this time Location Service has two data providers, [Esri](https://aws.amazon.com/location/data-providers/esri/) and [HERE](https://aws.amazon.com/location/data-providers/here-technologies/), as well as six default map styles. So, how do you customize these map styles to meet your brand or visual design?

This README will walk you through the process of styling an existing map using [Maputnik](https://maputnik.github.io/) to help visualize the changes in real-time. Others may prefer to use another open source tool called [Fresco](https://fresco.go-spatial.org/), however they are not required to make edits to the style descriptor. In order to style our existing map from Amazon Location Service using these tools we will also demonstrate how to run a local proxy that handles [Signature Version 4 / AWS Authentication](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html).

The following walk through is split into 2 parts:

1) [How to style an existing Map from Amazon Location Service section](#how-to-style-an-existing-map-from-amazon-location-service).
2) [How to integrate a custom map style in a React app](#how-to-integrate-a-custom-map-style-in-a-react-app)

## Prerequisites

1. [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

1. [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) (installed per-user, and invoked per-shell) OR [Node.js](https://nodejs.org/en/download/)

1. [AWS-CLI](https://docs.amplify.aws/lib/geo/getting-started/q/platform/js/#provisioning-resources-through-cli)

1. [Amplify CLI](https://docs.amplify.aws/cli/start/install) (Note: If you have a local environment that uses several AWS accounts be sure to use the correct AWS CLI profile and log in to the correct account in the browser)

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

    nvm use 15
    npm i tessera tilelive-aws
    ```

1. Presuming you have the standard AWS environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`) set correctly, this should be enough to get started using `tessera`. You'll need to provide the full file path to your module, so from your terminal run:

    ```bash

    node_modules/tessera/bin/tessera -r tilelive-aws aws:///<YOUR AMAZON LOCATION SERVICE MAP NAME>
    ```

    You can also add this as a script to your `package.json` file to save time on subsequent invocations.

1. You should see some output in sdtout like `Listening at http://0.0.0.0:8080`.

1. Now go back to Maputnik in your browser and click "Data Sources" in the top navigation bar. There should not be any active data sources. If you see any be sure to delete them.

    ![Data Sources](media/MaputnikDataSources.png)

    *Data Sources*

1. We're going to add a new data source as shown below.

- `Source ID`: `esri`
- `Source Type`: `Vector (XYZ URLs)`
- `1st Tile URL`: `http://localhost:8080/{z}/{x}/{y}.pbf`
- `Min Zoom`: `0`
- `Max Zoom`: `22`

    ![New Data Source](media/MaputnikNewSource.png)

    *New Data Source*

1. In addition to Tiles, the type of web map we will be styling also makes use of **Glyphs** and **Sprites**. We can't use Tessera to proxy the endpoints for these, but we can however use some out of the box endpoints built in to Maputnik. Sprites: `https://maputnik.github.io/osm-liberty/sprites/osm-liberty` and Glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key={key}`)

1. If you want to download a copy of the Sprites and Glyphs your Amazon Location Service Map uses we've included a helper script `downloadSpritesGlyphs.sh` :

    ```bash
    ./downloadSpritesGlyphs.sh <YOUR AMAZON LOCATION SERVICE MAP NAME> <YOUR AWS CLI PROFILE NAME>
    ```
  
This should create a folder for `sprites` and a folder for `glyphs` with a number of options for each. [Sprites](https://docs.aws.amazon.com/cli/latest/reference/location/get-map-sprites.html) can be either `.json` or `.png` files with an optional `@2x` version (Retina-quality images). [Glyphs](https://docs.aws.amazon.com/cli/latest/reference/location/get-map-glyphs.html) are a combination of a font-family and a Unicode range.

1. We can start with a ready-made style template. Click "Open" in the top navigation bar and under "Upload Style" click "Upload" and select the `example-style-descriptor.json` file included in this repo.

1. This is the style descriptor that is provided by Amazon Location Service as part of your Esri Map but with a few modifications. You can download this JSON file by making a request with the AWS CLI, i.e.

    ```bash

    aws location get-map-style-descriptor --map-name <YOUR AMAZON LOCATION SERVICE MAP NAME> example-style-descriptor.json --profile <YOUR AWS PROFILE NAME>
    ```

1. Because we are proxying our map tiles through a local tileserver we have changed a few lines in the descriptor JSON to point to the local endpoint. (We'll change them back later).

1. Before

    ```json
    ...
    "sources": {
      "amazon": {
        "type": "vector",
        "tiles": ["https://maps.geo.us-west-2.amazonaws.com/maps/v0/maps/<YOUR AMAZON LOCATION SERVICE MAP NAME>/tiles/{z}/{x}/{y}"],
        "minZoom": 0,
        "maxZoom": 22
      }
    },
    ...
    ```

    After

    ```json
    ...
    "sources": {
      "esri": {
        "attribution": "Esri, HERE, Garmin, FAO, NOAA, USGS, © OpenStreetMap contributors, and the GIS User Community",
        "maxzoom": 15,
        "tiles": ["http://localhost:8080/{z}/{x}/{y}.pbf"],
        "type": "vector"
      }
    },
    "sprite": "https://maputnik.github.io/osm-liberty/sprites/osm-liberty",
    "glyphs": "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key={key}",
    ...
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

- Familiarize yourself with the MapLibre style document specification <https://maplibre.org/maplibre-gl-js-docs/style-spec/>
- Learn hexadecimal color values and pick a palette of colors
- Follow web accessibility guidelines to ensure there are no impediments to users with disabilities
- Plan for adding map markers later on and choose a color that will contrast
- Use gradients and color transparency for greater detail
- Reserve blue colors for water layers only
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
     git clone https://github.com/aws-samples/amazon-location-samples.git
     cd amazon-location-samples/create-custom-map-style
     ```

1. Checkout Node version 15

    ```bash

    nvm install 15
    nvm use 15
    ```

    This allows you to use version 15 locally without setting a specific version globally (although you can install global packages *for that particular* version)

1. Install the application dependencies

    ```bash
    
    npm install
    ```

1. Configure Amplify environment `amplify configure`
 You will be prompted with the following:

    ```bash

    $ amplify configure

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

    $ amplify init

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

1. Run `amplify status` to see what will be provisioned

    ```bash
    
    $ amplify status

    Current Environment: <YOUR ENVIRONMENT NAME>

    | Category | Resource name                | Operation | Provider plugin   |
    | -------- | ---------------------------- | --------- | ----------------- |
    | Hosting  | S3AndCloudFront              | No Change | awscloudformation |
    | Auth     | createcustommapstyle0000000x | No Change | awscloudformation |
    | Geo      | CreateCustomMapStyle         | No Change | awscloudformation |
    ```

1. Push your backend to the cloud `amplify push` - It will create all the resources in the cloud

    ```bash

    $ amplify push

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

1. You can follow the steps in [How to style an existing Map from Amazon Location Service section](#how-to-style-an-existing-map-from-amazon-location-service) to style the map created through Amplify. Once you are satisfied with your edits continue to the [Publishing and Using Your Custom Maputnik Map](#publishing-and-using-your-custom-maputnik-map) section below.

### Publishing and Using Your Custom Maputnik Map

1. On your Maputnik tab in the browser, click "Export" in the top navigation bar
  
1. You should save the file as `example-file-descriptor.json` and place it in your React project's `src/` directory
  
1. Remember to change back the lines pointing to the local endpoints
 From

    ```json

    "tiles": ["http://localhost:8080/{z}/{x}/{y}.pbf"],
    ```

    To

    ```json

    "tiles": ["https://maps.geo.us-west-2.amazonaws.com/maps/v0/maps/<YOUR AMAZON LOCATION SERVICE MAP NAME>/tiles/{z}/{x}/{y}"],
    ```

    Also be sure to delete the `sprite` and `glyph` attributes.

    ```json

      "sprite": "https://maps.geo.us-west-2.amazonaws.com/maps/v0/maps/<YOUR AMAZON LOCATION SERVICE MAP NAME>/sprites/sprites",
      "glyphs": "https://maps.geo.us-west-2.amazonaws.com/maps/v0/maps/<YOUR AMAZON LOCATION SERVICE MAP NAME>/glyphs/{fontstack}/{range}.pbf",
    ```

1. We can change the background color of the `.map-container` selector to something like `#EE84D955` to see how the map style changes can be used to match the branding of the rest of a page. In your browser you can now refresh and see the changes you made in Maputnik show up in your own page.
  
   ![Changes Appear](media/ChangesAppear.png)

   *Changes Appear*

### React - Amazon Location Service Integration

1. Our React application includes an important library that uses WebGL to render interactive maps from [vector tiles](https://docs.mapbox.com/help/glossary/vector-tiles/) and [Maplibre styles](https://maplibre.org/maplibre-gl-js-docs/style-spec/)

    ```bash

    npm install maplibre-gl --save
    ```

1. We start by importing this dependency in the `SamplePage` component

    ```js

    ...
    import maplibregl from 'maplibre-gl';
    ...
    ```

1. Next, we make use of several React hooks. We add a reference (`useRef`) to the `.demo-map` DOM node, make an asynchronous API call (`useEffect`) to fetch data using Amplify, and we keep track of the latitude, longitude, and zoom level of the map (`useState`)

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

    <div ref={map} className="demo-map" />
    ```

1. `maplibre-gl-js-amplify` takes care of authenticating our user before calling Amazon Location Service when fetching the map tiles.

1. You should be able to start your React app and see the base map style show up in your browser now:

    ![Esri Streets Base Map](media/BaseMap.png)

    *Esri Streets Base Map*

## Clean Up

To avoid incurring future charges, delete the resources used in this tutorial. In the CloudFormation console you can delete the root stack `amplify-createcustommapstyle-<YOUR ENV NAME>-xxxxxx` which includes:

- `S3AndCloudFront`
- `createcustommapstyle0000000x`
- `CreateCustomMapStyle`

## Conclusion

Using Amazon Location Service with other AWS Services and open source tools such as Maputnik and MapLibre, you can create a fully customizable Map style specially when maps is an integral part of your application and you want to give your map a personalized touch. Now, if you have an idea about how you can achieve the map customization, you can also try it with [Fresco](https://fresco.gospatial.org/), MapBox Studio, and other open source tools for editing.
