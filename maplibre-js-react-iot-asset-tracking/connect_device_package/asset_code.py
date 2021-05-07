# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
#  SPDX-License-Identifier: MIT-0

from awscrt import io, mqtt, auth, http
from awsiot import mqtt_connection_builder
from datetime import datetime
import time
import json

# Define THING_ENDPOINT, CLIENT_ID, PATH_TO_THING_CERT, PATH_TO_PRIVATE_KEY, PATH_TO_CA_CERT, IOT_TOPIC
# """
# The following variableS will be used to establish a conection to AWS IoT MQTT Core message Broker.

# Variables
# ---------

# THING_ENDPOINT - The account region specific endpoint to connect devices to AWS IoT Core. You can get your end point from IoT Console > Manage > Things > Select the thing > Interact.
#
# CLIENT_ID - The id that will indetify the client on each message sent too IoT Core.
#
# PATH_TO_THING_CERT - The path in your project that leads to the device Certificate. You can get it when creating the device, or create a new one Later in IoT Console.
#
# PATH_TO_PRIVATE_KEY - The path in your project that leads to the private Device key. You can get the same way as the certificate.
#
# PATH_TO_CA_CERT - The path in your project that leads to Amazon Certification Authority Certificate. You can get it on AWS IoT Core DOcumentation in Server Authentication Section, under CA certificates for server authentication.
#
# IOT_TOPIC - The AWS IoT Core topic that messages will be published in.
#
# """

THING_ENDPOINT = "[Insert your Endpoint Here]"
CLIENT_ID = "trackThing01"
PATH_TO_THING_CERT = "certs/trackThing01-certificate.pem.crt"
PATH_TO_PRIVATE_KEY = "certs/trackThing01-private.pem.key"
PATH_TO_CA_CERT = "certs/root-CA.crt"

IOT_TOPIC = "iot/trackedAssets"

if __name__ == "__main__":
    # Spin up resources
    event_loop_group = io.EventLoopGroup(1)
    host_resolver = io.DefaultHostResolver(event_loop_group)
    client_bootstrap = io.ClientBootstrap(event_loop_group, host_resolver)
    mqtt_connection = mqtt_connection_builder.mtls_from_path(
        endpoint=THING_ENDPOINT,
        cert_filepath=PATH_TO_THING_CERT,
        client_bootstrap=client_bootstrap,
        pri_key_filepath=PATH_TO_PRIVATE_KEY,
        ca_filepath=PATH_TO_CA_CERT,
        client_id=CLIENT_ID,
        clean_session=False,
        keep_alive_secs=6,
    )
    print(("Connecting to {} with client ID '{}'...").format(THING_ENDPOINT, CLIENT_ID))
    connect_future = mqtt_connection.connect()
    # Future.result() waits until a result is available
    connect_future.result()
    print("Connected!")
    # Publish message to server desired number of times.
    print("Sending message(s)")
    # Publish locations in the map
    pointInMap = [
        {"lat": 49.282301, "long": -123.118408},
        {"lat": 49.282144, "long": -123.117574},
        {"lat": 49.282254, "long": -123.116522},
        {"lat": 49.282732, "long": -123.115799},
    ]
    for i in range(len(pointInMap)):
        now = datetime.now()
        timestamp = datetime.timestamp(now)
        MESSAGE = {
            "payload": {
                "deviceid": "thing123",
                "timestamp": timestamp,
                "location": pointInMap[i],
            }
        }
        print("Publishing message to topic '{}': {}".format(IOT_TOPIC, MESSAGE))
        mqtt_connection.publish(
            topic=IOT_TOPIC, payload=json.dumps(MESSAGE), qos=mqtt.QoS.AT_LEAST_ONCE
        )
        time.sleep(30)
    # Disconnect
    print("Disconnecting...")
    disconnect_future = mqtt_connection.disconnect()
    disconnect_future.result()
    print("Disconnected!")
