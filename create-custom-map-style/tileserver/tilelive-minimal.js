"use strict";

var http = require("http"),
  url = require("url"),
  util = require("util");

var _debug = require("debug"),
  mercator = new(require("@mapbox/sphericalmercator"))(),
  request = require("request"),
  retry = require("retry"),
  semver = require("semver");

var https = require('https'),
  aws4 = require('aws4'),
  Url = require('url-parse');

var zlib = require('zlib');

var meta = require("./package.json"),
  NAME = meta.name,
  VERSION = meta.version,
  debug = _debug(NAME);

var quadKey = function (zoom, x, y) {
  var key = "";

  for (var i = zoom; i > 0; i--) {
    var digit = "0";
    var mask = 1 << (i - 1);
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

module.exports = function (tilelive, options) {
  options = options || {};
  options.retry = "retry" in options ? options.retry : false;
  options.userAgent = options.userAgent || process.env.TILELIVE_USER_AGENT || [NAME, VERSION].join("/");
  options.acceptEncoding = 'gzip';

  var headers = {
      "User-Agent": options.userAgent,
      "Accept-Encoding": options.acceptEncoding,
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept': 'application/octet-stream',
    },
    retryOptions = {
      factor: 1.71023
    };

  if (!options.retry) {
    retryOptions.retries = 0;
  }

  var fetch = function (uri, callback) {
    var operation = retry.operation(retryOptions);
    return operation.attempt(function (currentAttempt) {
      const url = Url(uri);
      var opts = {
        uri,
        encoding: null,
        timeout: 36e3,
        host: url.hostname,
        path: url.pathname + url.query,
        service: 'geo',
        region: url.hostname.split('.')[2],
        headers
      }
      aws4.sign(opts);
      return request.get(opts, function (err, rsp, body) {
        if (operation.retry(err)) {
          debug("Failed %s after %d attempts:", url.format(uri), currentAttempt, err);
          return;
        }
        if (err) return callback(operation.mainError());

        switch (rsp.statusCode) {
          case 200:
          case 403:
          case 404:
            // var bod = Buffer.from(body).toString('base64');
            return callback(null, rsp, body);
          default:
            err = new Error(util.format("Upstream error: %s returned %d", uri, rsp.statusCode));
            if (rsp.statusCode.toString().slice(0, 1) !== "5") return callback(err);
            if (!operation.retry(err)) {
              return callback(operation.mainError(), rsp, body);
            } else {
              debug("Failed %s after %d attempts:", url.format(uri), currentAttempt, err);
            }
        }
      });
    });
  };

  var HttpSource = function (uri, callback) {
    if (semver.satisfies(process.version, ">=0.11.0")) {
      // Node 0.12 changes the behavior of url.parse such that components are
      // url-encoded
      uri.hash = uri.hash && decodeURIComponent(uri.hash);
      uri.pathname = decodeURIComponent(uri.pathname);
      uri.path = decodeURIComponent(uri.path);
      uri.href = decodeURIComponent(uri.href);
    }

    this.source = url.format(uri).replace(/(\{\w\})/g, function (x) {
      return x.toLowerCase();
    });

    if (!(this.source.match(/{z}/) &&
        this.source.match(/{x}/) &&
        this.source.match(/{y}/)) &&
      !this.source.match(/{q}/)) {
      console.log("Coordinate placeholders missing; assuming %s is a TileJSON endpoint (tilejson+).", this.source);

      return tilelive.load("tilejson+" + this.source, callback);
    }

    this.scale = uri.query.scale || 1;
    this.tileSize = (uri.query.tileSize | 0) || 256;

    // save ourselves some math if we don't need to generate a quad key
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
  };

  HttpSource.prototype.getTile = function (z, x, y, callback) {
    console.log('GETTING TILE')
    var tileUrl = this.source
      .replace(/{z}/i, z)
      .replace(/{x}/i, x)
      .replace(/{y}/i, y)
      .replace(/{q}/i, this.quadKey(z, x, y));

    if (this.scale > 1 && this.info.autoscale) {
      tileUrl = tileUrl.replace(/\.(?!.*\.)/, "@" + this.scale + "x.");
    }
    return fetch(tileUrl, function (err, rsp, body) {
      if (err) return callback(err);
      switch (rsp.statusCode) {
        case 200:
          var rspHeaders = ["age", "cache-control", "content-type", "content-md5", "content-encoding", "date", "expires"].reduce(function (obj, key) {
            if (rsp.headers[key]) {
              obj[key] = rsp.headers[key];
            }
            return obj;
          }, {});
          rspHeaders['content-encoding'] = 'gzip';

          return callback(null, zlib.gzipSync(body), rspHeaders);

        case 404:
          return callback(new Error("Tile does not exist"));

        default:
          return callback(new Error("Upstream error: " + rsp.statusCode));
      }
    });
  };

  HttpSource.prototype.getInfo = function (callback) {
    return setImmediate(callback, null, this.info);
  };

  HttpSource.prototype.close = function (callback) {
    callback = callback || function () {};
    return callback();
  };

  HttpSource.registerProtocols = function (tilelive) {
    tilelive.protocols["http:"] = HttpSource;
    tilelive.protocols["https:"] = HttpSource;
  };

  HttpSource.registerProtocols(tilelive);

  return HttpSource;
};