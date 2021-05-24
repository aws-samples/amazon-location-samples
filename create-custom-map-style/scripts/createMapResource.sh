#!/bin/sh
aws location \
  create-map \
  --map-name "CreateCustomMapStyle" \
  --configuration "Style=VectorEsriStreets" \
  --pricing-plan "RequestBasedUsage" \
  --profile $1 &