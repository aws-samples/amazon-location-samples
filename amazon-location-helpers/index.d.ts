// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Credentials } from "@aws-sdk/types";
import mapboxgl from "maplibre-gl";

interface Config {
  credentials?: Credentials;
  identityPoolId?: string;
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

export function getCredentialsForIdentityPool(
  identity: string
): Promise<Credentials>;
