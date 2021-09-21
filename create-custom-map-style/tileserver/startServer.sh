# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0
#!/usr/bin/env bash

node_modules/.bin/tessera -r $(pwd)/node_modules/tilelive-aws/tilelive-aws.js aws:///CreateCustomMapStyle
