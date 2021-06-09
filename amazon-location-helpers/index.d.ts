/// <reference types="aws-sdk" />

import { CredentialsOptions } from "aws-sdk/lib/credentials";
import mapboxgl from "maplibre-gl";

interface Config {
  credentials?: AWS.Credentials | CredentialsOptions;
  identityPoolId?: AWS.CognitoIdentity.IdentityPoolId;
  region?: string;
}

export function createMap(
  config: Config,
  options: mapboxgl.MapboxOptions,
  mapgl?: typeof mapboxgl
): Promise<mapboxgl.Map>;

export function createRequestTransformer(
  config: Config
): Promise<mapboxgl.TransformRequestFunction>;
