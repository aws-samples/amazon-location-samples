# Amazon Location Service - Create a custom map style

[Amazon Location Service (ALS)](https://aws.amazon.com/location/) is a managed AWS service in preview for adding location data to applications. It currently has two data providers, [Esri](https://aws.amazon.com/location/data-providers/esri/) and [HERE](https://aws.amazon.com/location/data-providers/here-technologies/), as well as six default map styles. What happens if you want to change the colors of your map to meet your brand or visual design?

This is particularly valuable if a map is a big part of your product flow or when a map is displayed in a location that needs to fit in well to the rest of the page. The following walk through will demonstrate how this is possible.

There are are various open source options for changing the style of a map, one of which we will demonstrate [Maputnik](https://maputnik.github.io/). In order to style our existing map we will run a local tile proxy that handles AWS [SigV4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) request signing to use Maputnik out of the box.
  
## Prerequisites

1. In your terminal create a workspace

    ```bash

    mkdir blog
    cd blog
    ```

1. Install [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) (installed per-user, and invoked per-shell) OR Install [Node.js](https://nodejs.org/en/download/) directly
1. Install the [AWS-CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
1. Install [Amplify](https://docs.amplify.aws/cli/start/install) (Note: If you have a local environment that uses several AWS accounts be sure to use the correct AWS CLI profile and log in to the correct account in the browser)
1. We're going to use **"Amplify-Default"** as our AWS CLI profile name and **"us-west-2"** as our AWS Region. Feel free to substitute these values.

## Option 1: Use this Pre-Built App

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
    ? Enter a name for the environment test
    Using default provider  awscloudformation
    ? Select the authentication method you want to use: AWS profile

    For more information on AWS Profiles, see:
    https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

    ? Please choose the profile you want to use Amplify-Default
    Adding backend environment test to AWS Amplify Console app:
    ....
    ```

1. Run amplify status to see what will be provisioned

    ```bash

    Current Environment: test

    | Category | Resource name                | Operation | Provider plugin   |
    | -------- | ---------------------------- | --------- | ----------------- |
    | Auth     | createcustommapstyled00xxx00 | Create    | awscloudformation |
    | Hosting  | S3AndCloudFront              | Create    | awscloudformation |
    ```

1. Edit `amplify/backend/hosting/S3AndCloudFront/parameters.json` and give the bucket a name you would like:

    ```json

    {
      "bucketName": "createcustommapstyle-<NAME>-hostingbucket"
    }
    ```

1. Push your backend to the cloud `amplify push` - It will create all the resources in the cloud

    ```bash

    ✔ Successfully pulled backend environment test from the cloud.
    
    Current Environment: test

    | Category | Resource name                | Operation | Provider plugin   |
    | -------- | ---------------------------- | --------- | ----------------- |
    | Auth     | createcustommapstyled00xxx00 | Create    | awscloudformation |
    | Hosting  | S3AndCloudFront              | Create    | awscloudformation |
    
    ? Are you sure you want to continue? Yes
    ⠋ Updating resources in the cloud. This may take a few minutes..
    ```

1. Wait for Cloudformation to provision the necessary resources. Once it's done you should get a message like this:

    ```bash

    ✔ All resources are updated in the cloud
      
    https://<UNIQUE ID>.cloudfront.net
    ```

1. You might see an *AccessDenied* error when navigating to this URL. You will have to update the hosting bucket policy and specify your Cloudfront Origin Access Identity (OAI) as the  `Principal`  by using its Amazon S3 canonical ID. For example:

    ```json

    "Principal": {
        "CanonicalUser": "`00x00xx000x000x00x00x0x000xxxxxxxx0x00x00xxxx0x0x0000x0xx00xx0xx`"
    }
    ```

 Replace  `00x00xx000x000x00x00x0x000xxxxxxxx0x00x00xxxx0x0x0000x0xx00xx0xx`  with the OAI’s canonical ID. You can find the OAI’s canonical ID in the same ways that you find its ID in the Cloudfront management console.

 ![Origin Access Identity](media/OAI.png)
 *Origin Access Identity*

1. The React App can then be run with `npm start` and the deployed app can be updated with `amplify publish` whenever you like. Skip to
[*Creating Amazon Location Service Resources*](#creating-amazon-location-service-resources) in this README to continue.

## Option 2: Start from Scratch

### Create a new React app

1. Install and use Node v12

    ```bash

    nvm install 12 
    nvm use 12
    ```

1. From your workspace run

    ```bash

    npx create-react-app create-custom-map-style 
    cd create-custom-map-style
    ```

 This will create a new React desktop application for you

### Amplify Setup

1. Follow the instructions to initialize a new Amplify project [as outlined here](https://docs.amplify.aws/cli/start/workflows#initialize-new-project)

1. For the prompts enter the following:

  ```bash

    $ amplify init
    
    Note: It is recommended to run this command from the root of your app directory
    ? Choose your default editor: Visual Studio Code (or whatever editor you prefer)
    ? Choose the type of app that you're building javascript
    Please tell us about your project
    ? What javascript framework are you using react
    ? Source Directory Path:  src
    ? Distribution Directory Path: build
    ? Build Command:  npm run-script build
    ? Start Command: npm run-script start
    Using default provider awscloudformation

    For more information on AWS Profiles, see:
    https://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html

    ? Do you want to use an AWS profile? Yes
    ? Please choose the profile you want to use  Amplify-Default
  ```

1. That leaves us with a root stack for our Amplify project in CloudFormation, now let's add the `Auth` category:

    ```bash

    $ amplify add auth
    
    Using service: Cognito, provided by: awscloudformation
    The current configured provider is Amazon Cognito.
    Do you want to use the default authentication and security con
    figuration? Yes, use the default configuration.
    Successfully added resource cognito0cc0c000 locally

      Some next steps:
    "amplify push" will build all your local backend resources and provision it in the cloud
    "amplify publish" will build all your local backend and frontend resources (if you have 
    hosting category added) and provision it in the cloud
    ```

 (Note: `cognito0cc0c000` will always include a UUID generated by Amplify so substitute it for yours in the following steps)

1. The new resources have only been configured in our local environment so let's publish them to our AWS Account:

    ```bash

    $ amplify push
    
    | Category | Resource name   | Operation | Provider plugin   |
    | -------- | --------------- | --------- | ----------------- |
    | Auth     | cognito0xx0x000 | Create    | awscloudformation |
    ? Are you sure you want to continue? Yes
    ```

1. You might get an error like this:

    ```bash

    CREATE_FAILED UserPoolClientLambda                                  AWS::Lambda::Function
          
    Wed Apr 07 2021 16:50:55 GMT-0400 (Eastern Daylight Time) The runtime parameter of 
    nodejs6.10 is no longer supported for creating or updating AWS Lambda functions. 
    We recommend you use the new runtime (nodejs12.x) while creating or updating functions.
    ```

    In which case we can manually edit the CloudFormation template generated by Amplify to replace all occurrences of `nodejs6.10` with `nodejs12` either in our IDE or with the command line as shown below:

    ```bash

    cd ~/.../create-custom-map-style/amplify/backend/auth/cognito0cc0c000
    sed -i -e 's/nodejs6.10/nodejs12.x/g' cognito0cc0c000-cloudformation-template.yml
    cd ~/blog/create-custom-map-style
    amplify push
    ```

1. After the Auth resource are created you should notice an autogenerated `aws-exports.js` in your project's `src` directory

### React-Amplify Integration

1. Now that we've set up all the Authorization infrastructure needed for our application, we can test it out with our frontend React application. To start we need to add the `aws-amplify` package to our dependencies

    ```bash

    npm i aws-amplify
    ```

1. Open `src/index.js` in your IDE

1. Under your existing list of import statements create a new line and add the following:

    ```js

    ...
    import  Amplify  from  "aws-amplify";
    import  awsExports  from  "./aws-exports";
    ```

1. Next we'll need to configure our Amplify so above the `ReactDOM.render` line let's add the following:

    ```js

    ...
    Amplify.configure(awsExports);
    ...
    ```

 The `configure()` method is just setting the AWS resources that we want to use for our backend. It might look intimidating, but just remember this isn’t doing anything special here beside configuration.

1. At this point your `src/index.js` file should something like this:

    ```js
    import  React  from  'react';
    import  ReactDOM  from  'react-dom';
    import  './index.css';
    import  App  from  './App';
    import  reportWebVitals  from  './reportWebVitals';
    import  Amplify  from  'aws-amplify';
    import  awsExports  from  './aws-exports';

    Amplify.configure(awsExports);
    
    ReactDOM.render(
      <React.StrictMode>
        <App  />
      </React.StrictMode>,
      document.getElementById('root')
    );


    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
    ```

1. After configuring Amplify at the React application's top-level module it can be used in child components. In our particular case this is only `App.js`

1. Before we proceed we will need to bring in a few more dependencies, in your terminal run the following commands:

    ```bash
    npm i @aws-amplify/ui-react
    ```

1. Open `src/App.js` in your IDE. Under your existing list of existing import statements create a new line and add the following:

    ```js
    ...
    import { withAuthenticator } from  '@aws-amplify/ui-react';
    ```

1. Replace your module export line - `export default App;` - with the following:

    ```js
    export default withAuthenticator(App);
    ```

1. Amplify's React library provides an extremely useful higher order component to provide authentication for your app. By simply wrapping your application's existing code in this one component you now have a complete authentication flow (login/logout)

1. To test out your app's new login screen open your terminal and start the react app:

    ```bash
    npm start
    ```

 You should see a login screen as shown below. Being that this is the first time you are running the app with authentication you will need to create a new account to login

 ![Cognito Hosted UI Login Screen](media/Login.png)
 *The Cognito Hosted UI Login Screen*

1. Once you've created a new account and logged in you should be presented with the default React app UI

 ![Create React App Screen](media/CRA.png)
 *The create react app default screen*

### Creating a Map UI view

 1. To create this view we'll start with the HTML / CSS skeleton before adding the business logic with JS. I've renamed my `App` component (`src/App.js` and `src/App.css`) to `SamplePage`, but you can feel free to keep the name `App.js`. Open this file in your IDE.

 1. Inside the `return` statement we're going to erase everything and start from scratch. At the root we're going to start with a simple `div` element with a `class` attribute of `sample-page`. Your functional component should look something like this:

    ```js
    function SamplePage() {
      return (
        <div className="sample-page">
          
        </div>
      );
    }
    ```

 1. Next we'll add in some sample content, a level one header with the title of the page:

    ```html
    <div className="sample-page">
      <h1>Amazon Location Service - Create Your Own Custom Map Style</h1>
    </div>
    ```

 1. Then we'll add a container for the kind of map we're going to demo

    ```js
    // Below h1
    ...
      <div className="map-container">
    
      </div>
    ...
    ```

 1. Inside the container we'll give it a `sidebar` and a `map` div

    ```js
    ...
    <div className="map-container">
      <div className="demo-sidebar">
      <div>
        Longitude: 
        <br />
        Latitude:
        <br />
        Zoom:
        <br />
      </div>  
      </div>
      <div className="demo-map" />
    </div>
    ...
    ```

 1. The page now needs some styling so in `src/SamplePage.css` remove the existing styling and add the following:

    ```css
    .sample-page {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    
    .map-container {
      display: flex;
          justify-content: center;
      align-items: center;
      border: 0.25px  solid  black;
      padding: 5px;
    }
    
    .demo-map {
      height: 500px;
      width: 500px;
      border: 0.25px  solid  black;
      margin: 5px;
    }
    ```

 1. Be sure to import your CSS in the `SamplePage` component:

    ```js
    import  './SamplePage.css'
    ```

 1. Your page should look like this now:

 ![App Skeleton](media/AppSkeleton.png)
 *App Skeleton*

### Creating Amazon Location Service Resources

Make sure you have the following or higher version of **aws-cli**

```bash
aws --version

aws-cli/2.1.39 Python/3.9.4 Darwin/19.6.0 source/x86_64 prompt/off
```

Navigate to the directory where you have your scripts  

1. Create Map resource

    ```bash

    ./createMapResource.sh Amplify-Default
    ```

    The output will look like the following:

    ```bash

    2021-00-00X00:00:00.000000+00:00  arn:aws:geo:us-west-2:{accountNumber}:map/CreateCustomMapStyle CreateCustomMapStyle
    ```

1. Navigate to [AWS Location Services Console](https://console.aws.amazon.com/location/home) and check under Maps, if the Map resource have been created.

1. We are using Esri Street Map as our base map style. This comprehensive street map includes highways, major roads, minor roads, railways, water features, cities, parks, landmarks, building footprints, and administrative boundaries.

1. Set IAM Permissions

    ```bash

    ./setIamPermissions.sh <YOUR COGNITO AUTH ROLE NAME>  Amplify-Default <YOUR ACCOUNT ID> us-west-2
    ```

1. Navigate to [AWS IAM Console](https://aws.amazon.com/iam/home) , check under Roles if the role you just created in the above step exists, click on the Role Name > Policy Name and you will be able to find the Policy (JSON object) which will look like this :

    ```json

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PlaceIndexReadOnly",
                "Effect": "Allow",
                "Action": [
                    "geo:GetMapStyleDescriptor",
                    "geo:GetMapGlyphs",
                    "geo:GetMapSprites",
                    "geo:GetMapStyleDescriptor",
                    "geo:GetMapTile"
                ],
                "Resource": "arn:aws:geo:<YOUR ACCOUNT ID>:us-west-2:map/CreateCustomMapStyle"
            },
            {
                "Sid": "MapsReadOnly",
                "Effect": "Allow",
                "Action": [
                    "geo:GetMapStyleDescriptor",
                    "geo:GetMapGlyphs",
                    "geo:GetMapSprites",
                    "geo:GetMapStyleDescriptor",
                    "geo:GetMapTile"
                ],
                "Resource": "arn:aws:geo:<YOUR ACCOUNT ID>:us-west-2:map/CreateCustomMapStyle"
            }
        ]
    }
    ```

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
    import { Auth } from  'aws-amplify';
    ...
    const  SamplePage = () => {
      const  map = useRef();
      const [coordinates, setCoordinates] = useState({
      lat:  40.7356,
      lng: -74.0541,
      zoom:  12.44,
      });
      useEffect(async () => {
      const  credentials = await  Auth.currentCredentials();
      const { lat, lng, zoom } = coordinates;
      const  demoMap = new  mapboxgl.Map({
        container:  map.current,
        center: { lng, lat },
        zoom,
        style:  'http://localhost:3000/example-style-descriptor.json',
        transformRequest:  transformRequest(credentials),
      });
      demoMap.on('move', () => {
        setCoordinates({
        lng:  demoMap.getCenter().lng.toFixed(4),
        lat:  demoMap.getCenter().lat.toFixed(4),
        zoom:  demoMap.getZoom().toFixed(2),
        });
      });
      return () =>  demoMap.remove();
      }, []);
    })
    ...

    // And in your return statement below change
    // <div className="demo-map" />
    // to

    <div ref={map} className="demo-map" />
    ```

1. You may notice that we're calling a `transformRequest` function in the constructor for the map. We'll need to add this now. Create a new file in the `src` directory called `transformRequest.js` and paste the following:

    ```js

    import { Signer } from  '@aws-amplify/core';

    export  default (credentials) => (url, resourceType) => {
      if (resourceType === "Style" && !url.includes("://")) {
      url = `https://maps.geo.us-west-2.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
      }
      if (url.includes("amazonaws.com")) {
      return {
        url:  getSignedUrl(url, credentials),
      };
      }
      return {
      url
      };
    }

    export  const  getSignedUrl = (url, credentials) => {
      return  Signer.signUrl(url, {
      access_key:  credentials.accessKeyId,
      secret_key:  credentials.secretAccessKey,
      session_token:  credentials.sessionToken,
      });
    }
    ```

1. Be sure to import the function in your `SamplePage` component
1. You should be able to go back to your browser now and see the base map style show up inside your `demo-map` div

 ![Esri Streets Base Map](media/BaseMap.png)
 *Esri Streets Base Map*

## Styling a Custom Map

1. Maputnik is an open source visual editor for the [Mapbox Style Specification](https://www.mapbox.com/mapbox-gl-js/style-spec). At the time of writing this editor can be either used in the browser or downloaded as a binary and can run locally. We are going to use the latter option.
1. Go to <https://github.com/maputnik/editor/wiki/Maputnik-CLI> and follow the instructions for installation or optionally from your terminal:

    ```bash

    wget <https://github.com/maputnik/editor/releases/download/latest/maputnik-darwin.zip>
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

1. Next we need to add the Amazon Location Service API as a data source. However, in order to do this we need to use a local proxy that can handle SigV4 (TL;DR a way to provide your AWS credentials with http requests). For this we will use [tessera](https://github.com/mojodna/tessera). From a new terminal (the `maputnik` process will be occupying the other terminal) run the following:

    ```bash

    nvm use 12
    npm i -g tessera tilejson tilelive-xray @mapbox/tilelive @mapbox/tilejson
    ```

1. Tessera is a pluggable [map tile](https://en.wikipedia.org/wiki/Tiled_web_map) server. Using the power of the [tilelive](https://github.com/mapbox/tilelive) ecosystem, it is capable of serving and rendering map tiles from many sources. To stream data from most sources you can install the tilelive providers as global npm packages. For an Amazon Location Service source we will create and use our own module to get a basic environment set up with minimal code changes.
1. From your terminal run

    ```bash

    mkdir tileserver
    cd tileserver
    ```

1. We'll need to init a new node project in the current directory

    ```bash

    npm init --yes
    ```

1. Replace the generated `/tileserver/package.json` (DO NOT overwrite the top-level `package.json`) with the following:

    ```json

    {
      "name": "tileserver",
      "version": "1.0.0",
      "description": "",
      "main": "tilelive-aws.js",
      "scripts": {},
      "keywords": [],
      "author": "",
      "license": "ISC",
      "dependencies": {
          "aws4": "^1.11.0",
        "debug": "^4.3.1",
        "request": "^2.88.2",
        "retry": "^0.12.0",
        "semver": "^7.3.5",
        "url-parse": "^1.5.1"
      },
      "peerDependencies": {
        "@mapbox/tilelive": "*",
        "@mapbox/tilejson": ">= 0.6.4"
      }
    }
    ```

1. Install these dependencies by running `npm install`.
1. In your IDE create a new file called `tileserver/tilelive-aws.js`
1. Copy and paste (or download) the `tileserver/tilelive-aws.js` file.
1. The module makes use of several environment variables to be able to sign calls to the AWS API. You can run the following to generate the required AWS credentials:

    ```bash

    $ aws sts get-session-token --duration-seconds 36000 --profile Amplify-Default

    {
      "Credentials": {
        "AccessKeyId": "XXXX0XX0X0XXXXXX0XXX",
        "SecretAccessKey": "x0XXxxXXXxXxXX0xXxxX0XXxX0X0xxxx0XxxxxXX",
        "SessionToken": "XXxXx0XXxX0xxX0XxXXx//////////....=",
        "Expiration": "2021-01-01T00:00:00+00:00"
      }
    }
    ```

    Set these environment variables in your terminal like so:

    ```bash

    export AWS_ACCESS_KEY_ID=<Access Key from Previous Step>
    export AWS_SECRET_ACCESS_KEY=<Secret Key from Previous Step>
    export AWS_SESSION_TOKEN=<Session Token from Previous Step>
    ```

    or optionally run the helper script we've included (be sure to have jq installed first, `brew install jq` on Mac, or follow instructions for other platforms here: <https://stedolan.github.io/jq/download/>):
    `./setAwsEnvVariables.sh Amplify-Default`

1. This should be enough to get started using `tessera`. You'll need to provide the full file path to your module, so from your terminal run:

    ```bash

    tessera -r $(pwd)/tilelive-aws.js aws://maps.geo.us-west-2.amazonaws.com/maps/v0/maps/CreateCustomMapStyle/tiles/\{z\}/\{x\}/\{y\}
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

1. While we could start from scratch to style the map it is easier to demonstrate with a starter template taken from our map style. Click "Open" in the top navigation bar and under "Upload Style" click "Upload" and select the `src/public/example-style-descriptor.json` file.

1. This is the style descriptor that is provided by Amazon Location Service as part of your Esri Map. You can download this JSON file by making a signed request to the API endpoint, i.e.

    ```bash

    aws location get-map-style-descriptor --map-name CreateCustomMapStyle style-descriptor.json --profile <YOUR AWS PROFILE NAME>
    ```

 We recommend using a SigV4 request-signing library such as [aws4](https://github.com/mhart/aws4#example).

1. Because we are proxying our map tiles through our local tileserver we'll need to change one line in the descriptor JSON to point to the correct endpoint. (We'll change it back later).

1. Change Line 7
  From

    ```json

    "tiles": ["<https://maps.geo.us-west-2.amazonaws.com/maps/v0/maps/CreateCustomMapStyle/tiles/{z}/{x}/{y>}"],
    ```

    To

    ```json

    "tiles": ["<http://localhost:8080/{z}/{x}/{y>}"],
    ```

1. From the "*View*" dropdown let's select "*Map*"

1. Now we should see a list of layers appear on the left side of the screen

 ![List of Layers](media/MaputnikLayers.png)
 *List of Layers*

1. Let's select the `Land/Not ice` Layer

 ![Land Not ice](media/MaputnikLandNotIce.png)
 *The Land/Not ice Layer*

1. Scroll down to the JSON Editor section on the left navigation panel

 ![JSON Editor](media/MaputnikJSONEditor.png)
 *The JSON Editor*

1. Note that its fill color is `#f7f6d5`, let's change it to something funky like `#EE84D9`

1. Now you can see how the map's style has changed a little, you play around some more by clicking on certain areas of the map and seeing which layer it corresponds. Feel free to change colors or outlines

## Map Styling Tips

To help you with your map styling decisions, here are some handy tips:

- Learn the MapLibre style document specification <https://maplibre.org/maplibre-gl-js-docs/style-spec/>
- Learn hexadecimal color values and pick a palette of colors
- Add map accessibility when needed (i.e. color-blind awareness)
- Plan for map markers and choose colors that will contrast
- Use gradients and color transparency for greater detail
- Reserve blue for water layers only
- Ensure legible text values by choosing the best label background and text halo

## Publishing and Using Your Custom Maputnik Map

1. Once you're satisfied with the changes you've made to the map style, the next step is to export and bundle the style JSON with your frontend assets
  
1. On your Maputnik tab in the browser, click "Export" in the top navigation bar
  
1. You should save the file as `example-file-descriptor.json` and place it back in your project's `public/` directory
  
1. Remember to change back Line 7
 From

    ```json

    "tiles": ["<http://localhost:8080/{z}/{x}/{y>}"],
    ```

    To

    ```json

    "tiles": ["<https://maps.geo.us-west-2.amazonaws.com/maps/v0/maps/CreateCustomMapStyle/tiles/{z}/{x}/{y>}"],
    ```

1. In your browser you can now refresh and see the changes you made in Maputnik show up in your own page.
  
   ![Changes Appear](media/ChangesAppear.png)
   *Changes Appear*

## Teardown

The teardown is relatively easy with the Amplify CLI here's how we can do it within a few short steps

1. From the root directory of your project run `amplify status` to see what stacks exist currently

    ```bash

    $ amplify status
    
    Current Environment: test

    | Category | Resource name                | Operation | Provider plugin   |
    | -------- | ---------------------------- | --------- | ----------------- |
    | Hosting  | amplifyhosting               | No Change | awscloudformation |
    | Auth     | createcustommapstyled09deb85 | No Change | awscloudformation |
    | Hosting  | S3AndCloudFront              | No Change | awscloudformation |

    Hosting endpoint: <https://something.cloudfront.net>
    ```

1. To delete everything simply run `amplify delete`

    ```bash

      $ amplify delete

      ? Are you sure you want to continue? This CANNOT be undone. (This will delete
      all the environments of the project from the cloud and wipe out all the loca
      l files created by Amplify CLI) Yes
      ⠋ Deleting resources from the cloud. This may take a few minutes...
      Deleting env:test
      ✔ Project deleted in the cloud
      Project deleted locally.
    ```

1. The Amazon Location Service Map resource can also deleted from the CLI either by running the included script

    ```bash
    
    ./deleteMapResource.sh Amplify-Default
    ```
  
    or optionally

    ```bash
  
    aws location \
      delete-map \
      --map-name "CreateCustomMapStyle" \
      --profile Amplify-Default
    ```

## Conclusion

Using Amazon Location Service with other AWS Services and Maputnik/ MapLibre GL JS which are an open source, you can create a fully customizable Map style especially when maps are an integral part of your application and you want to give your maps a personalized touch
