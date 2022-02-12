import { useState } from 'react';
import { Geo } from 'aws-amplify';
import { Text, withAuthenticator } from '@aws-amplify/ui-react';
import Map, { NavigationControl } from "react-map-gl";
import maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import Header from './components/Header';
import Body from './components/Body';
import Markers from './components/Markers';
import LineOverlay from './components/LineOverlay';
import useTracker from './hooks/useTracker';
import useAmplifyMapLibre from './hooks/useAmplifyMapLibre';

function App() {
  const [viewState, setViewState] = useState({
    longitude: -123.1169,
    latitude: 49.2824,
    zoom: 16,
  });

  const amplifyMapLibre = useAmplifyMapLibre();
  const [trackerPositions] = useTracker(amplifyMapLibre, {
    DeviceId: "thing123",
    TrackerName: "trackerAsset01", // This is the Tracker name, change it according to your own setup
    EndTimeExclusive: new Date(),
    StartTimeInclusive: new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 30)),
  });

  return (
    <>
      <Header />
      <Body>
        {amplifyMapLibre ? (
          <Map
            {...viewState}
            mapLib={maplibregl}
            style={{ width: "100%", height: "100%" }}
            transformRequest={amplifyMapLibre.transformRequest}
            mapStyle={Geo.getDefaultMap().mapName}
            onMove={(e) => setViewState(e.viewState)}
          >
            <NavigationControl showCompass={false} />
            <Markers trackerPositions={trackerPositions} />
            <LineOverlay trackerPositions={trackerPositions} />
          </Map>
        ) : <Text>Loading...</Text>}
      </Body>
    </>
  );
}

export default withAuthenticator(App);
