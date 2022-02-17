import json
import boto3
import math

def create_geofence(longitude, latitude, radius, identifier):  
    geofence = []

    #creates inverted polygon
    coordinates = create_polygon(longitude, latitude, radius)
    geofence.append(create_coordinate_structure(coordinates, identifier))     

    return geofence
    
#creates polygon
def create_polygon(longitude, latitude, radius, vertices=20):
    center = (longitude,latitude)

    # converts the radius to its approximate in meters (~10% off)
    radius = radius / 100000.00

    angle = 0
    angle -= (math.pi/vertices)
    
    coord_list = [[center[0] + radius * math.sin((2*math.pi/vertices) * i - angle), center[1] + radius * math.cos((2*math.pi/vertices) * i - angle)] for i in range(vertices)]
    coord_list.append(coord_list[0])
    
    return coord_list
    
#formats amazon location geofence
def create_coordinate_structure(coordinates, identifier):
    #inverts the polygon array to confirm with Amazon Location's API
    coordinates.reverse()
    return {
	    'GeofenceId': identifier,
		'Geometry': {
		'Polygon': [coordinates]
		}
	}

#creates geofence on amazon location
def batch_put_geofence(longitude, latitude, radius, collection_name, geofence_identifier):
    location = boto3.client('location')

    # Creates the geofence with the center point, radius, and identifier
    geofence = create_geofence(longitude, latitude, radius, geofence_identifier)
    
    response = location.batch_put_geofence(
				CollectionName=collection_name,
				Entries=geofence)
				
    return(response)


