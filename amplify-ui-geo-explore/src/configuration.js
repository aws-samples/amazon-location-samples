// This configuration file is a single place to provide any values to set up the app

export const IDENTITY_POOL_ID =
  "eu-west-1:ccf1eafc-5862-4736-8bf4-450a0f887ccc"; // REQUIRED - Amazon Cognito Identity Pool ID

export const REGION = "eu-west-1"; // REQUIRED - Amazon Cognito Region

export const MAP = {
  NAME: "darkMap", // REQUIRED - Amazon Location Service map resource name
  STYLE: "VectorEsriDarkGrayCanvas", // REQUIRED - String representing the style of map resource
};

export const PLACE = "placeIndex"; // REQUIRED - Amazon Location Service place index resource name

export const ROUTE = "myCalculator"; // REQUIRED - Amazon Location Service route calculator resource name

export const GEOFENCE = "myCollection"; // REQUIRED - Amazon Location Service geofence collection resource name

export const TRACKER = "myTrackerz"; // REQUIRED - Amazon Location Service tracker resource name

export const TRACKER_SIMULATED_DEVICE = "Vehicle-1"; // REQUIRED - Simulated Device ID (Defaulting to Vehicle-1)
