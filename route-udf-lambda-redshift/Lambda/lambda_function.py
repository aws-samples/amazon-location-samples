# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

import json
import logging
import time
from route import *

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):

    logger.debug (event)
    
    try:
        response = dict()
        records = event["arguments"]
        logger.debug ("Record Count: %d" % len(records))

        t1 = time.time()    
        results = []
        
        for record in records:
            logger.debug(record)
            longitude_origin, latitude_origin, longitude_destination, latitude_destination = record
            try:
                results.append(json.dumps(calculate_route(longitude_origin, latitude_origin, longitude_destination, latitude_destination)))
            except:
                results.append(None)

        t2 = time.time()

        logger.info ("Result Count: %d Time: %.3f" % (len(results), t2 - t1))
        
        response['success'] = True
        response['results'] = results
    except Exception as e:
        response['success'] = False
        response['error_msg'] = str(e)

    logger.info (response)

    return json.dumps(response)
