# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

import logging
import time
from geocode import *

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):

    try:    
        logger.debug (event)
        
        t1 = time.time()
        response = geocode_address(event["address_line"], event["municipality_name"], event["state_code"], event["post_code"], event["country_code"])
        t2 = time.time()
        logger.debug ("Time: %.3f" % (t2 - t1))

    except Exception as e:
        logger.exception (e)
        response ={
            "Exception": str(e)
        }

    return response
