const awsIot = require("aws-iot-device-sdk");

// Replace with your AWS IoT endpoint
const THING_ENDPOINT = "<code>-ats.iot.us-east-1.amazonaws.com";
const CLIENT_ID = "trackThing01";
const IOT_TOPIC = "iot/trackedAssets";

const POINTS_ON_MAP = [
  { lat: 49.282301, long: -123.118408 },
  { lat: 49.282144, long: -123.117574 },
  { lat: 49.282254, long: -123.116522 },
  { lat: 49.282732, long: -123.115799 },
];

const device = awsIot.device({
  host: THING_ENDPOINT,
  keyPath: `${__dirname}/certs/private.pem.key`,
  certPath: `${__dirname}/certs/certificate.pem.crt`,
  caPath: `${__dirname}/certs/root-CA.pem`,
  clientId: CLIENT_ID,
  keepalive: 60000,
});

console.log("Connecting to %s with client ID %s", THING_ENDPOINT, CLIENT_ID);

device.on("connect", async function () {
  console.log("Connected to device %s", CLIENT_ID);

  for (const point of POINTS_ON_MAP) {
    const message = {
      payload: {
        deviceId: "thing123",
        timestamp: new Date().getTime(),
        location: point,
      },
    };
    console.log(
      "Publishing message to topic %s: %s",
      IOT_TOPIC,
      JSON.stringify(message)
    );
    device.publish(IOT_TOPIC, JSON.stringify(message), { qos: 1 });

    // Set timeout to sleep
    await new Promise((resolve) => setTimeout(resolve, 30000));
  }

  device.end();
});
