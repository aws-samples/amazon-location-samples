// Use Signer from @aws-amplify/core
const { Signer } = window.aws_amplify_core;

// AWS Resources **ADD YOUR IDENTITYPOOLID**
// Cognito:
const identityPoolId = "us-east-1:45c10fd2-4143-490c-9fcb-1474cc4265b3";

// Amazon Location Service resource names:
const mapName = "explore.map";
const placesName = "explore.place";

// Extract the region from the Identity Pool ID
AWS.config.region = identityPoolId.split(":")[0];

// Instantiate a Cognito-backed credential provider
const credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: identityPoolId,
});

let map = null;
let markers = []

// Sign requests made by MapLibre GL JS using AWS SigV4:
function transformRequest(url, resourceType) {
  if (resourceType === "Style" && !url.includes("://")) {
    // Resolve to an AWS URL
    url = `https://maps.geo.${AWS.config.region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
  }

  if (url.includes("amazonaws.com")) {
    // Sign AWS requests (with the signature as part of the query string)
    return {
      url: Signer.signUrl(url, {
        access_key: credentials.accessKeyId,
        secret_key: credentials.secretAccessKey,
        session_token: credentials.sessionToken,
      }),
    };
  }

  // If not amazonaws.com, falls to here without signing
  return { url };
}

// Initialize a map
async function initializeMap() {
  // Load credentials and set them up to refresh
  await credentials.getPromise();
  
  // Initialize the map
  const mlglMap = new maplibregl.Map({
    container: "map", // HTML element ID of map element
    center: [-77.03674, 38.891602], // Initial map centerpoint
    zoom: 16, // Initial map zoom
    style: mapName,
    transformRequest,
  });

  // Add navigation control to the top left of the map
  mlglMap.addControl(new maplibregl.NavigationControl(), "top-left");
  
  return mlglMap;
}


async function main() {
  // Initialize map and AWS SDK for Location Service:
  map = await initializeMap();

  const location = new AWS.Location({credentials, region: AWS.config.region});
}

async function onButtonClick() {
  markers = []
  let response = document.getElementById('response');
  response.innerHTML = '';
  const location = new AWS.Location({credentials, region: AWS.config.region});
  zip = document.getElementById("fname").value;
  await getLatLonFromZip(zip, location, getPlaces)
}



let getPlaces = async (latLon, location) => {
      // Search for results around coordinate values
      params = {
        "IndexName": "explore.place",
        "Text": "library",
        "BiasPosition": latLon,
        "MaxResults": 9
      };
      let results = ""
      return new Promise((res, rej) => {
        location.searchPlaceIndexForText(params, function(err, data) {
          if (err) {
            // Alert user about an error
            console.log("There was an error searching.");
    
            // Write JSON response error to HTML
            return "error"
          } else {
            results = data.Results; 
            res(results)
          }
        });
      })
}


async function getLatLonFromZip(zip, location, callback) {
  //Get Lat/Lon from Zip, then get libraries from callback
  params = {
    "IndexName": "explore.place",
    "Text": zip,
    "MaxResults": 1
  };

  await location.searchPlaceIndexForText(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else { // successful response
      let lat = data.Results[0].Place.Geometry.Point[0]
      let lon = data.Results[0].Place.Geometry.Point[1]
      map.setCenter([lat,lon])
      let res = callback([lat, lon], location)
        .then(res =>{
          displayResults(res)
          displayMarker(res)
          
        });
    }           
  });
  
}


function displayResults(results) {
  //display each result on the right panel (id=response)
  response = document.getElementById('response');
          
  results.forEach((place, i) => {
    let placeItem = document.createElement('div')
    placeItem.id = i
    placeItem.classList.add('result-item');
    placeItem.appendChild(document.createTextNode(place.Place.Label))
    placeItem.addEventListener("mouseover", resultOnHover, false);
    placeItem.addEventListener("mouseout", resultOnHover, false)
    response.appendChild(placeItem)
  });
}


function displayMarker(results){
  //display marker for each result on the map
  results.forEach((place, i) => {
    let marker = new maplibregl.Marker()
      .setLngLat([place.Place.Geometry.Point[0], place.Place.Geometry.Point[1]])
      .addTo(map)
      .setPopup(new maplibregl.Popup().setHTML("<p style='color: black'>" +place.Place.Label + "</p>")) // add popup
    markers.push(marker)
  });

  let bbox = [
    [
      results[0].Place.Geometry.Point[0],
      results[0].Place.Geometry.Point[1]
    ],
    [
      results[results.length-1].Place.Geometry.Point[0],
      results[results.length-1].Place.Geometry.Point[1]
    ]
  ]

  map.fitBounds(bbox, {
    padding: {top: 10, bottom:25, left: 15, right: 5}
  });
}

function resultOnHover(e){ 
  //Toggle the popup for each marker on mouseover and mouseout events
  let id = e.target.id
  markers[id].togglePopup()
}

main();