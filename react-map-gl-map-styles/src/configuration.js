// This configuration file is a single place to provide any values to set up the app

export const IDENTITY_POOL_ID =
  "XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab"; // REQUIRED - Amazon Cognito Identity Pool ID

export const REGION = "XX-XXXX-X"; // REQUIRED - Amazon Cognito Region

// These are the different Amazon Location Service map styles that users can switch to display
export const MAPS = [
  {
    NAME: "XXXXXXXXXXX", // REQUIRED - Amazon Location Service Map resource name
    STYLE: "XXXXXXXXXXX", // REQUIRED - String representing the style of map resource
    LABEL: "XXXXXXXXXXX", // REQUIRED - Text to be displayed for the map in the layer control box
  },
  {
    NAME: "XXXXXXXXXXX", // REQUIRED - Amazon Location Service Map resource name
    STYLE: "XXXXXXXXXXX", // REQUIRED - String representing the style of map resource
    LABEL: "XXXXXXXXXXX", // REQUIRED - Text to be displayed for the map in the layer control box
  },
];
