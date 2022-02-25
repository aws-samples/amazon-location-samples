// Use Signer from @aws-amplify/core
const { Signer } = window.aws_amplify_core;

// AWS Resources
// Cognito:
const identityPoolId = "<Identity Pool ID>";

// Amazon Location Service:
const mapName = "<Map Resource Name>";
const placesName = "<Places Resource Name>";

// Extract the region from the Identity Pool ID
AWS.config.region = identityPoolId.split(":")[0];

// Instantiate a Cognito-backed credential provider
const credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: identityPoolId,
});

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
  const map = await initializeMap();
  const location = new AWS.Location({credentials, region: AWS.config.region});

  // Variable to hold marker that will be rendered on click
  let marker;

  // On mouse click, display marker and get results:
  map.on("click", function(e) {
    // Remove any existing marker
    if(marker) {
      marker.remove();
    }

    // Render a marker on clicked point
    marker = new maplibregl.Marker()
      .setLngLat([e.lngLat.lng, e.lngLat.lat])
      .addTo(map);

    // Set up parameters for search call
    let params = {
      IndexName: placesName,
      Position: [e.lngLat.lng, e.lngLat.lat],
      Language: "en",
      MaxResults: "5"
    };

    // Search for results around clicked point
    location.searchPlaceIndexForPosition(params, function(err, data) {
      if (err) {
        // Write JSON response error to HTML
        document.querySelector("#response").textContent = JSON.stringify(err, undefined, 2);

        // Display error in an alert box
        alert("There was an error searching.");
      } else {
        // Write JSON response data to HTML
        document.querySelector("#response").textContent = JSON.stringify(data, undefined, 2);

        // Display place label in an alert box
        alert(data.Results[0].Place.Label);
      }
    });
  });
}

main();
