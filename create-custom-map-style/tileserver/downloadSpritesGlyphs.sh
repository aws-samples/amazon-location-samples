# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0
#!/usr/bin/env bash
if [ -z "$1" ]; then
  echo "Map Name not provided";
  exit 1;
fi
if [ -z "$2" ]; then
  echo "AWS Profile not provided";
  exit 1;
fi

mkdir sprites
mkdir glyphs
cd sprites
aws location get-map-sprites --file-name sprites.png --map-name $1 --profile $2 sprites.png
aws location get-map-sprites --file-name sprites@2x.png --map-name $1 --profile $2 sprites@2x.png
aws location get-map-sprites --file-name sprites.json --map-name $1 --profile $2 sprites.json
aws location get-map-sprites --file-name sprites@2x.json --map-name $1 --profile $2 sprites@2x.json
cd ../glyphs
mkdir Ubuntu%20Medium%20Italic
aws location get-map-glyphs --font-stack "Ubuntu Medium Italic" --font-unicode-range 0-255.pbf --map-name $1 --profile $2 Ubuntu%20Medium%20Italic/0-255.pbf

mkdir Roboto%20Condensed%20Light%20Italic
aws location get-map-glyphs --font-stack "Roboto Condensed Light Italic" --font-unicode-range 0-255.pbf --map-name $1 --profile $2 Roboto%20Condensed%20Light%20Italic/0-255.pbf

mkdir Arial%20Regular
aws location get-map-glyphs --font-stack "Arial Regular" --font-unicode-range 0-255.pbf --map-name $1 --profile $2 Arial%20Regular/0-255.pbf

# https://maputnik.github.io/osm-liberty/sprites/osm-liberty
# https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key={key}