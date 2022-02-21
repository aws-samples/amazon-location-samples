import json
import boto3
import math

#reads the geojson file and returns all geofences
def read_geofence_file(file):
    geofences_array = []
    
    try:
        # Opening JSON file
        f = open(file)
         
        # returns JSON object as
        # a dictionary
        data = json.load(f)
         
        # Iterating through the json
        # list of polygon features
        if not 'features' in data:
            return []

        #creates features array
        features = data['features']
        
        #for each feature select the ones with type Polygon and append the coordinates
        for feature in features:
            if 'geometry' in feature and 'type' in feature['geometry']:
                geometry = feature['geometry']
                type = geometry['type']
                
                if type == 'Polygon':
                    geofences_array.append(geometry['coordinates'])  
                
        # Closing file
        f.close()
        
        return geofences_array
    except IOError:
        print ("Could not open file")
        return []
    
def create_geofences(geofences_from_file):  
    geofences = []
    
    count = 0
    for coordinates in geofences_from_file:
        count+=1
        
        #create geofence identifier
        identifier = 'Geofence-' + str(count)
        
        #creates inverted polygon with identifier and coordinates structure
        structure = create_coordinate_structure(coordinates, identifier)
        
        #append structure to array
        geofences.append(structure)

    return geofences
    
#formats amazon location geofence
def create_coordinate_structure(coordinates, identifier):
    #inverts the polygon array to confirm with Amazon Location's API
    coordinates.reverse()
    return {
	    'GeofenceId': identifier,
		'Geometry': {
		'Polygon': coordinates
		}
	}

#creates geofence on amazon location
def batch_put_geofence(geojson_file, collection_name):
    #reads geofences from file
    geofences_from_file = read_geofence_file(geojson_file)

    #creates geofence confirming to Amazon Location's structure
    geofences = create_geofences(geofences_from_file)
    
    location = boto3.client('location')

    # batch put geofences to collection
    response = location.batch_put_geofence(
				CollectionName=collection_name,
				Entries=geofences)
				
    return(response)

batch_put_geofence('sample.json', 'GeoJSONCollection')

