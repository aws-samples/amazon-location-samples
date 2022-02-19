# Geofence utils

This repository contains helpers files to facilitate common practices using Amazon Location Service.

## create-circular-geofence.py

`create-circular-geofence.py` is a Python file that helps customers create circular geofences in a Collection, a feature currently unsupported by the service.

To create a geofence, call the `batch_put_geofence` function passing the a longitude/latitude pair (representing a center point), a radius in meters, a collection name, and the geofence identifier.

For example:

```python
batch_put_geofence(-47.72117614746094, -17.14341496307439, 200, 'TestGeofesadasnces', 'test')
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

## create-geojson-geofence.py

`create-geojson-geofence.py` is a Python file that helps customers create geofences from a GeoJSON file in a Collection, a feature currently unsupported by the service outside of the console.

To create a geofence, call the `batch_put_geofence` function passing the a GeoJSON file name and a collection name.

For example:

```python
batch_put_geofence('sample.json', 'GeoJSONCollection')
```

### AWS Lambda example

To create a Lambda Funcion use a handler with the following definition:

```python
def lambda_handler(event, context):

    geojson_file = event['geojson_file']
    collection = event['collection']

    response = batch_put_geofence(geojson_file, collection)

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
The example below showcases a test event that you can use to validate the funcion by creating 3 geofences:

```json
{
  "geojson_file": "sample.json",
  "collection": "GeoJSONCollection"
}
```

And here is an example of a GeoJSON file containing 3 geofences:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              57.65624999999999,
              62.103882522897855
            ],
            [
              56.953125,
              59.5343180010956
            ],
            [
              58.35937499999999,
              56.17002298293205
            ],
            [
              67.8515625,
              56.559482483762245
            ],
            [
              72.421875,
              62.2679226294176
            ],
            [
              67.5,
              65.5129625532949
            ],
            [
              57.65624999999999,
              63.860035895395306
            ],
            [
              57.65624999999999,
              62.103882522897855
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              96.328125,
              69.90011762668541
            ],
            [
              92.46093749999999,
              71.07405646336098
            ],
            [
              81.5625,
              69.16255790810501
            ],
            [
              82.6171875,
              63.39152174400882
            ],
            [
              96.6796875,
              61.60639637138628
            ],
            [
              106.171875,
              62.75472592723178
            ],
            [
              112.8515625,
              65.5129625532949
            ],
            [
              96.328125,
              69.90011762668541
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              121.9921875,
              62.59334083012024
            ],
            [
              118.125,
              56.36525013685606
            ],
            [
              111.4453125,
              50.064191736659104
            ],
            [
              121.640625,
              47.27922900257082
            ],
            [
              130.4296875,
              54.16243396806779
            ],
            [
              136.7578125,
              60.23981116999893
            ],
            [
              135.703125,
              64.32087157990324
            ],
            [
              121.9921875,
              62.59334083012024
            ]
          ]
        ]
      }
    }
  ]
}
```
