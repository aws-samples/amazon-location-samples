// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

"use strict";

const {
  Location
} = require("@aws-sdk/client-location");
const url = require("url"),
  util = require("util"),
  _debug = require("debug"),
  request = require("request"),
  retry = require("retry"),
  semver = require("semver"),
  aws4 = require('aws4'),
  Url = require('url-parse'),
  zlib = require('zlib');



const quadKey = function (zoom, x, y) {
  let key = "";

  for (let i = zoom; i > 0; i--) {
    let digit = "0";
    const mask = 1 << (i - 1);
    if ((x & mask) !== 0) {
      digit++;
    }
    if ((y & mask) !== 0) {
      digit++;
      digit++;
    }
    key += digit;
  }

  return key;
};


module.exports = function (tilelive) {
  const client = new Location();

  // Usage: node_modules/.bin/tl copy -r tilelive-aws -z 0 -Z 2 aws:///assetTracker file://./tiles?filetype=mvt
  // npm install tl tilelive-file
  class AwsSource {
    constructor(uri, callback) {
      // aws:///MapName
      // this uses the path component rather than the host because URL normalization will downcase the host and resource names are case-sensitive
      this.mapName = uri.path.slice(1);

      // TODO call client.getMapStyleDescriptor to get the zoom ranges for the available tiles (in the sources block)
      this.info = {
        bounds: [-180, -85.0511, 180, 85.0511],
        minzoom: 0,
        maxzoom: Infinity,
        format: "pbf",
      };

      //
      if (semver.satisfies(process.version, ">=0.11.0")) {
        uri.hash = uri.hash && decodeURIComponent(uri.hash);
        uri.pathname = decodeURIComponent(uri.pathname);
        uri.path = decodeURIComponent(uri.path);
        uri.href = decodeURIComponent(uri.href);
      }

      this.source = url.format(uri).replace(/(\{\w\})/g, function (x) {
        return x.toLowerCase();
      });
      this.scale = uri.query.scale || 1;
      this.tileSize = (uri.query.tileSize | 0) || 256;
      if (this.source.match(/{q}/)) {
        this.quadKey = quadKey;
      } else {
        this.quadKey = function () {};
      }

      // abuse the URI object by looking for .info directly on it
      this.info = uri.info || {};
      this.info.autoscale = "autoscale" in this.info ? this.info.autoscale : true;
      this.info.bounds = this.info.bounds || [-180, -85.0511, 180, 85.0511];
      this.info.minzoom = "minzoom" in this.info ? this.info.minzoom : 0;
      this.info.maxzoom = "maxzoom" in this.info ? this.info.maxzoom : Infinity;


      return callback(null, this);
    }

    async getTile(z, x, y, callback) {
      try {
        console.log(this.source);
        // for raster tiles, this will always fetch the 256x256 version
        const tile = await client.getMapTile({
          MapName: this.mapName,
          Z: z,
          X: x,
          Y: y,
        });
        return callback(null, tile.Blob, {});
      } catch (err) {
        return callback(err);
      }
    }

    getInfo(callback) {
      return setImmediate(callback, null, this.info);
    }

    close(callback) {
      callback = callback || function () {};
      return callback();
    }
  }

  tilelive.protocols["aws:"] = AwsSource;

  return AwsSource;
};
