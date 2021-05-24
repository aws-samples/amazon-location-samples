# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0
#!/bin/sh
aws location \
  delete-map \
  --map-name "CreateCustomMapStyle" \
  --profile $1 &
  