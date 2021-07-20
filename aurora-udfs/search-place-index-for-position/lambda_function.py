from os import environ

import boto3
from botocore.config import Config

# load the place index name from the environment, falling back to a default
PLACE_INDEX_NAME = environ.get("PLACE_INDEX_NAME", "AuroraUDFs")

location = boto3.client("location",
    config=Config(user_agent="Amazon Aurora PostgreSQL"))

"""
This Lambda function receives a payload from Amazon Aurora and translates it to
an Amazon Location `SearchPlaceIndex` call and returns the results as-is, to be
post-processed by a PL/pgSQL function.
"""
def lambda_handler(event, context):
    kwargs = {}
    
    if event.get("maxResults") is not None:
        kwargs["MaxResults"] = event["maxResults"]
    
    return location.search_place_index_for_position(
        IndexName=PLACE_INDEX_NAME,
        Position=event["position"],
        **kwargs)["Results"]
