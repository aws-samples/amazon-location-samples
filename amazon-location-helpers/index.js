// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const { Signer } = require("@aws-amplify/core");
const {
  fromCognitoIdentityPool,
} = require("@aws-sdk/credential-provider-cognito-identity");
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
let maplibregl;
let mapboxgl;

try {
  maplibregl = require("maplibre-gl");
} catch {}
try {
  mapboxgl = require("mapbox-gl");
} catch {}

function validateCredentials(credentials) {
  const { accessKeyId, secretAccessKey } = credentials;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("Valid credentials are required to fetch map resources.");
  }
}

function validateRegion(region) {
  if (!region) {
    throw new Error("A valid region is required to fetch map resources.");
  }
}

function createCognitoCredentialProvider(identityPoolId) {
  return fromCognitoIdentityPool({
    client: new CognitoIdentityClient({
      region: identityPoolId.split(":")[0],
    }),
    identityPoolId,
  });
}

async function createRequestTransformer({
  credentials,
  identityPoolId,
  region,
}) {
  if (identityPoolId != null) {
    // use the region containing the identity pool if one wasn't provided
    region = region || identityPoolId.split(":")[0];
    const provider = createCognitoCredentialProvider(identityPoolId);

    // refresh credentials before they expire
    async function refreshCognitoCredentials() {
      credentials = await provider();

      setTimeout(
        refreshCognitoCredentials,
        credentials.expiration - new Date()
      );
    }

    await refreshCognitoCredentials();
  }

  validateCredentials(credentials);
  validateRegion(region);

  return (url, resourceType) => {
    if (resourceType === "Style" && !url.includes("://")) {
      // resolve to an AWS URL
      url = `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
    }

    if (url.includes("amazonaws.com")) {
      // only sign AWS requests (with the signature as part of the query string)
      return {
        // @aws-sdk/signature-v4 would be another option, but this needs to be synchronous
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

function getCredentialsForIdentityPool(identityPoolId) {
  return createCognitoCredentialProvider(identityPoolId)();
}

module.exports = {
  createMap,
  createRequestTransformer,
  getCredentialsForIdentityPool,
};
