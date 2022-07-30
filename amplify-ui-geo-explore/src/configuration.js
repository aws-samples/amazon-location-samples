// This configuration file is a single place to provide any values to set up the app

export const IDENTITY_POOL_ID =
  "XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab"; // REQUIRED - Amazon Cognito Identity Pool ID

export const REGION = "XX-XXXX-X"; // REQUIRED - Amazon Cognito Region

export const MAP = {
  NAME: "XXXXXXXXXXX", // REQUIRED - Amazon Location Service map resource name
  STYLE: "XXXXXXXXXXX", // REQUIRED - String representing the style of map resource
};

export const PLACE = "XXXXXXXXXXX"; // REQUIRED - Amazon Location Service place index resource name

export const ROUTE = "XXXXXXXXXXX"; // REQUIRED - Amazon Location Service route calculator resource name

export const GEOFENCE = "XXXXXXXXXXX"; // REQUIRED - Amazon Location Service geofence collection resource name

export const TRACKER = "XXXXXXXXXXX"; // REQUIRED - Amazon Location Service tracker resource name

export const TRACKER_SIMULATED_DEVICE = "Vehicle-1"; // REQUIRED - Simulated Device ID (Defaulting to Vehicle-1)
