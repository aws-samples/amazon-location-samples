# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0
#!/bin/sh
aws iam \
  put-role-policy \
  --role-name $1 \
  --policy-name "AllowMapResourcesPolicy" \
  --policy-document "{ \"Version\": \"2012-10-17\", \"Statement\": [ 
    { \"Sid\": \"PlaceIndexReadOnly\", \"Effect\": \"Allow\", \"Action\": [ \"geo:GetMapStyleDescriptor\", \"geo:GetMapGlyphs\", \"geo:GetMapSprites\", \"geo:GetMapStyleDescriptor\", \"geo:GetMapTile\" ], \"Resource\": \"arn:aws:geo:$3:$4:map/$5\" } ] }" \
  --profile $2 &
  