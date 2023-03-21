import { Signer } from "@aws-amplify/core";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { identityPoolId } from "./config";

const region = identityPoolId.split(":")[0];

const identityProvider = fromCognitoIdentityPool({
  client: new CognitoIdentityClient({
    region: region,
  }),
  identityPoolId,
});

let credentials;
const refreshCredentials = async () => {
  credentials = await identityProvider();
  setTimeout(refreshCredentials, credentials.expiration - new Date());
};

const transformRequest = (url, resourceType) => {
  if (resourceType === "Style" && !url.includes("://")) {
    url = `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
  }

  if (url.includes("amazonaws.com")) {
    return {
      url: Signer.signUrl(url, {
        access_key: credentials.accessKeyId,
        secret_key: credentials.secretAccessKey,
        session_token: credentials.sessionToken,
      }),
    };
  }

  return { url };
};

export { region, credentials, refreshCredentials, transformRequest };
