// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");
const { Signer } = require("@aws-amplify/core");
let maplibregl;
let mapboxgl;

try {
  maplibregl = require("maplibre-gl");
} catch {}
try {
  mapboxgl = require("mapbox-gl");
} catch {}

function autoRefreshCredentials(credentials) {
  return refreshCredentials(credentials);
}

async function refreshCredentials(credentials) {
  await credentials.refreshPromise();

  if (credentials.expireTime) {
    // Set a timer to refresh the credentials before they next expire
    setTimeout(
      refreshCredentials,
      credentials.expireTime - new Date(),
      credentials
    );
  }
}

async function createRequestTransformer({
  credentials,
  identityPoolId,
  region,
}) {
  if (identityPoolId != null) {
    region = region || identityPoolId.split(":")[0];
    credentials = new AWS.CognitoIdentityCredentials(
      {
        IdentityPoolId: identityPoolId,
      },
      {
        region,
      }
    );
  }

  if (!region) {
    throw new Error("missing region in config");
  }

  // refresh credentials, renewing them when necessary
  if (credentials instanceof AWS.Credentials) {
    await autoRefreshCredentials(credentials);
  }

  return (url, resourceType) => {
    if (resourceType === "Style" && !url.includes("://")) {
      // resolve to an AWS URL
      url = `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
    }

    if (url.includes("amazonaws.com")) {
      // only sign AWS requests (with the signature as part of the query string)
      return {
        url: Signer.signUrl(url, {
          access_key: credentials.accessKeyId,
          secret_key: credentials.secretAccessKey,
          session_token: credentials.sessionToken,
        }),
      };
    }

    // don't sign
    return { url };
  };
}

async function createMap(config, options, mapgl) {
  const transformRequest = await createRequestTransformer(config);

  return new (mapgl || maplibregl || mapboxgl).Map({
    ...options,
    transformRequest,
  });
}

module.exports = {
  createMap,
  createRequestTransformer,
};
