import { useState, useEffect, useRef } from 'react';
import { Geo, Hub } from 'aws-amplify';
import { LocationClient, GetDevicePositionHistoryCommand } from '@aws-sdk/client-location';

const useTracker = (amplifyMapLibre, requestParams) => {
  const locationClient = useRef();
  const [trackerPositions, setTrackerPositions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTracerLocations = async () => {
      if (amplifyMapLibre) {
        // If the transformer is ready, create a new LocationClient instance if one doesn't exist
        if (!locationClient.current) {
          // create a new LocationClient instance and save it in a ref
          // so it persists re-renders and takes care of renewing the AWS credentials
          locationClient.current = new LocationClient({
            region: (Geo.getDefaultMap()).region,
            credentials: amplifyMapLibre.credentials,
          });
        }
        // If the trackerPositions state is empty, fetch the device position history
        if (trackerPositions.length === 0) {
          try {
            const res = await locationClient.current.send(new GetDevicePositionHistoryCommand(requestParams));
            if (res.DevicePositions.length === 0) {
              throw new Error("No device position history found");
            }
            setTrackerPositions(res.DevicePositions);
          } catch (error) {
            console.error('Unable to get tracker positions', error);
            Hub.dispatch('errors', {
              data: `Unable to get Tracker history from Amazon Location Service.
              Try refreshing the page, if the error persists check the browser console for more details`
            });
          }
        }
      }
    }

    getTracerLocations();
  }, [trackerPositions, setError, amplifyMapLibre, requestParams]);

  return [trackerPositions, error];
};

export default useTracker;