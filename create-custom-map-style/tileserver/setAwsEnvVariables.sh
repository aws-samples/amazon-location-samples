# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0
#!/bin/bash

export -n AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
creds_json=$(aws --output json sts get-session-token --duration-seconds 86400 --profile $1)
if [[ $rv -ne 0 || ! $creds_json ]]; then
    echo "$pkg: failed to get credentials: $creds_json" 1>&2
fi
jq="jq --exit-status --raw-output"
AWS_ACCESS_KEY_ID=$(echo "$creds_json" | $jq .Credentials.AccessKeyId)
if [[ $rv -ne 0 || ! $AWS_ACCESS_KEY_ID ]]; then
    echo "$pkg: failed to parse output for AWS_ACCESS_KEY_ID: $creds_json" 1>&2
fi
AWS_SECRET_ACCESS_KEY=$(echo "$creds_json" | $jq .Credentials.SecretAccessKey)
if [[ $rv -ne 0 || ! $AWS_SECRET_ACCESS_KEY ]]; then
    echo "$pkg: failed to parse output for AWS_SECRET_ACCESS_KEY: $creds_json" 1>&2
fi
AWS_SESSION_TOKEN=$(echo "$creds_json" | $jq .Credentials.SessionToken)
if [[ $rv -ne 0 || ! $AWS_SESSION_TOKEN ]]; then
    echo "$pkg: failed to parse output for AWS_SESSION_TOKEN: $creds_json" 1>&2
fi
export AWS_REGION=us-west-2
export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID 
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY 
export AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN 

echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID; AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY; AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN; export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN"
