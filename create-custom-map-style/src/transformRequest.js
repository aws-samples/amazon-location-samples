import {
  Signer
} from '@aws-amplify/core';

export default (credentials) => (url, resourceType) => {
  if (resourceType === "Style" && !url.includes("://")) {
    url = `https://maps.geo.us-west-2.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
  }
  if (url.includes("amazonaws.com")) {
    return {
      url: getSignedUrl(url, credentials),
    };
  }
  return {
    url
  };
}

export const getSignedUrl = (url, credentials) => {
  return Signer.signUrl(url, {
    access_key: credentials.accessKeyId,
    secret_key: credentials.secretAccessKey,
    session_token: credentials.sessionToken,
  });
}
