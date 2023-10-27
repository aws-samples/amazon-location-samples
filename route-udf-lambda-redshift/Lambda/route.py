# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

import boto3
import botocore
import json
import logging
import os
import time

calculator_name = os.environ["ROUTE_CALCULATOR"]

logger = logging.getLogger()
logger.setLevel(logging.INFO)

location = boto3.client("location", config=botocore.config.Config(user_agent="Amazon Redshift"))

def calculate_route(departure_longitude, departure_latitude, destination_longitude, destination_latitude):

    try:
        if departure_longitude == "":
            raise ValueError("Missing departure longitude")
    
        if departure_latitude == "":
            raise ValueError("Missing departure latitude")

        if destination_longitude == "":
            raise ValueError("Missing destination longitude")
    
        if destination_latitude == "":
            raise ValueError("Missing destination latitude")
        
        try:
            t1 = time.time()
            response = location.calculate_route(CalculatorName=calculator_name, 
                                                DeparturePosition=[departure_longitude, departure_latitude],
                                                DestinationPosition=[destination_longitude, destination_latitude],
                                                TravelMode="Car",
                                                DepartNow=False,
                                                DistanceUnit="Miles")
            t2 = time.time()
            logger.info("Route Time: %.3f" % (t2 - t1))
            if (response["ResponseMetadata"]["HTTPStatusCode"] > 200):
                logger.error("Error in calling Amazon Location Service")
                return "Error in calling Amazon Location Service"

            logger.debug (response["Summary"])
            logger.debug ("ResponseTime\t%.3f\tDistance\t%.2f" % (t2 - t1, response["Summary"]["Distance"]))
                
            response = {
                "DriveDistance": round(response["Summary"]["Distance"],2),
                "DistanceUnit": response["Summary"]["DistanceUnit"],
                "DriveTime": round(response["Summary"]["DurationSeconds"]/60,2),
                "TimeUnit": "Minutes"
            }
        except botocore.exceptions.ClientError as ce:
            logger.exception (ce.response)
            response = {
                "DriveDistance": 0,
                "DistanceUnit": "",
                "DriveTime": 0,
                "TimeUnit": "",
                ce.response["Error"]["Code"]: ce.response["Error"]["Message"]
            }
        except botocore.exceptions.ParamValidationError as pve:
            logger.exception (pve)
            response = {
                "DriveDistance": 0,
                "DistanceUnit": "",
                "DriveTime": 0,
                "TimeUnit": "",
                "ParamValidationError": str(pve)
            }
    except Exception as e:
        logger.exception (e)
        response ={
            "DriveDistance": 0,
            "DistanceUnit": "",
            "DriveTime": 0,
            "TimeUnit": "",
            "Exception": str(e)
        }
    
    logger.debug (response)
    
    return response