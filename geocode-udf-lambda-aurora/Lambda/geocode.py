# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

import boto3
import botocore
import json
import logging
import os
import time

index_name = os.environ["PLACE_INDEX"]

logger = logging.getLogger()
logger.setLevel(logging.INFO)

location = boto3.client("location", config=botocore.config.Config(user_agent="Amazon Aurora PostgreSQL"))

def geocode_address(address_line, municipality_name, state_code, post_code, country_code):

    try:
        if address_line == "":
            raise ValueError("Missing address line")
    
        if municipality_name == "":
            raise ValueError("Missing municipality name")
        
        if state_code == "None":
            state_code = ""
            
        if post_code == "None":
            post_code = ""
            
        if country_code == "None":
            raise ValueError("Missing country code")
    
        try:
            t1 = time.time()
            text = ("%s, %s %s %s" % (address_line, municipality_name, state_code, post_code))
            response = location.search_place_index_for_text(IndexName=index_name, FilterCountries=[country_code], Text=text)
            t2 = time.time()
            logger.info("Geocode Time: %.3f" % (t2 - t1))
    
            data = response["Results"]
            if len(data) >= 1:
                point = data[0]["Place"]["Geometry"]["Point"]
                label = data[0]["Place"]["Label"]
                logger.debug ("Match: [%s,%s] %s" % (point[0], point[1], label))
                
                response = {
                    "Longitude": point[0],
                    "Latitude": point[1],
                    "Label": label,
                    "MultipleMatch": False
                }
                
                if len(data) > 1:
                    response["MultipleMatch"] = True
            else:
                logger.debug ("No geocoding results found")
                
                response = {
                    "Error": "No geocoding results found"
                }
        except botocore.exceptions.ClientError as ce:
            logger.exception (ce.response)
            response = {
                ce.response["Error"]["Code"]: ce.response["Error"]["Message"]
            }
        except botocore.exceptions.ParamValidationError as pve:
            logger.exception (pve)
            response = {
                "ParamValidationError": str(pve)
            }
    except Exception as e:
        logger.exception (e)
        response ={
            "Exception": str(e)
        }
    
    logger.info (response)

    return response
