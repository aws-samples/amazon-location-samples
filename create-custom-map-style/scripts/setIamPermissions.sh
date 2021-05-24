#!/bin/sh
aws iam \
  put-role-policy \
  --role-name $1 \
  --policy-name "AllowMapResourcesPolicy" \
  --policy-document "{ \"Version\": \"2012-10-17\", \"Statement\": [ \\\\\
    { \"Sid\": \"PlaceIndexReadOnly\", \"Effect\": \"Allow\", \"Action\": [ \"geo:GetMapStyleDescriptor\", \"geo:GetMapGlyphs\", \"geo:GetMapSprites\", \"geo:GetMapStyleDescriptor\", \"geo:GetMapTile\" ], \"Resource\": \"arn:aws:geo:$3:$4:map/CreateCustomMapStyle\" }, \\\\\\
  { \"Sid\": \"MapsReadOnly\", \"Effect\": \"Allow\", \"Action\": [ \"geo:GetMapStyleDescriptor\", \"geo:GetMapGlyphs\", \"geo:GetMapSprites\", \"geo:GetMapStyleDescriptor\", \"geo:GetMapTile\" ], \"Resource\": \"arn:aws:geo:$3:$4:map/CreateCustomMapStyle\" } ] }" \
  --profile $2 &