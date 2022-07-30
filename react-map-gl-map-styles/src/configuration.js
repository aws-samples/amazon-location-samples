// This configuration file is a single place to provide any values to set up the app

export const IDENTITY_POOL_ID =
  "eu-west-1:ccf1eafc-5862-4736-8bf4-450a0f887ccc"; // REQUIRED - Amazon Cognito Identity Pool ID

export const REGION = "eu-west-1"; // REQUIRED - Amazon Cognito Region

// These are the different Amazon Location Service map styles that users can switch to display
export const MAPS = [
  {
    NAME: "lightMap", // REQUIRED - Amazon Location Service Map resource name
    STYLE: "VectorEsriLightGrayCanvas", // REQUIRED - String representing the style of map resource
    LABEL: "Light", // REQUIRED - Text to be displayed for the map in the layer control box
  },
  {
    NAME: "darkMap", // REQUIRED - Amazon Location Service Map resource name
    STYLE: "VectorEsriDarkGrayCanvas", // REQUIRED - String representing the style of map resource
    LABEL: "Dark", // REQUIRED - Text to be displayed for the map in the layer control box
  },
];
