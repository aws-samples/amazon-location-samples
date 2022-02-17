# Geofence Utils

This repository contains helpers files to facilitate common geofence practices using Amazon Location Service.

## create-geofence.py

`create-circular-geofence.py` is a Python file that helps customers create circular geofences in a Collection, a feature currnelty unsupported by the service.

To create a geofence, call the `batch_put_geofence` function passing the a longitude/latitude pair (representing a center point), a radius in meters, a collection name, and the geofence identifier.

For example:

```python
batch_put_geofence(-47.72117614746094, -17.14341496307439, 200, 'TestGeofesadasnces', 'test')```
```

### AWS Lambda example

To create a Lambda Funcion use a handler with the following definition:

```python
def lambda_handler(event, context):

    longitude = event['longitude']
    latitude = event['latitude']
    radius = event['radius']
    collection = event['collection']
    identifier = event['identifier']
    
    response = batch_put_geofence(longitude, latitude, radius, collection, identifier)

    response_code = response['ResponseMetadata']['HTTPStatusCode']	
    body = 'Success' if response_code == 200 else 'Error'
    return {
        'statusCode': response_code,
        'body': body
    }   
```

For that a policy needs to be included to the Lambda role role. This is an example of the policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "geo:BatchPutGeofence",
            "Resource": "arn:aws:geo:[REGION]:[ACCOUNT]:geofence-collection/[COLLECTION-NAME]"
        }
    ]
}
```
The example below showcases a test event that you can use to validate the funcion by creating a geofence:

```json
{
  "longitude": -47.72117614746094,
  "latitude": -17.14341496307439,
  "radius": 200,
  "collection": "TestGeofences",
  "identifier": "test"
}
```
## Security

See [CONTRIBUTING](https://github.com/aws-samples/amazon-location-samples/blog/main/CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
