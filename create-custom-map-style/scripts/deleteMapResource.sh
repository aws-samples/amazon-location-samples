#!/bin/sh
aws location \
  delete-map \
  --map-name "CreateCustomMapStyle" \
  --profile $1 &