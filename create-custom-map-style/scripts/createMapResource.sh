# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0
#!/bin/sh
aws location \
  create-map \
  --map-name $2 \
  --configuration "Style=VectorEsriStreets" \
  --pricing-plan "RequestBasedUsage" \
  --profile $1 &
