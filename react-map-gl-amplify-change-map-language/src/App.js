import { useState } from 'react';
import { Text } from '@aws-amplify/ui-react';
import Map, { NavigationControl } from "react-map-gl";
import maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import Body from './components/Body';
import Markers from './components/Markers';
import LanguagesControl from './components/LanguagesControl';
import useLocalizedStyleDescriptor from './hooks/useLocalizedStyleDescriptor';
import useAmplifyMapLibre from './hooks/useAmplifyMapLibre';

function App() {
  const [language, setLanguage] = useState('');
  const viewState = {
    longitude: -123.1169,
    latitude: 49.2824,
    zoom: 1.5,
  };
  const [marker, setMarker] = useState();

  const amplifyMapLibre = useAmplifyMapLibre();
  const [mapStyle, languagesList] = useLocalizedStyleDescriptor(
    amplifyMapLibre, // Pass the AmplifyMapLibreRequest instance to the hook, this holds the AWS credentials
    language // Pass the selected language, if none is selected, the default language is used
  );

  return (
    <>
      <Body>
        {amplifyMapLibre && mapStyle ? (
          <Map
            initialViewState={{ ...viewState }}
            mapLib={maplibregl}
            style={{ width: "100%", height: "100%" }}
            transformRequest={amplifyMapLibre.transformRequest}
            mapStyle={mapStyle} // Pass the localize style descriptor to the map
            onClick={(e) => setMarker(e.lngLat)}
          >
            <LanguagesControl languagesList={languagesList} setLanguage={setLanguage} />
            <NavigationControl showCompass={false} />
            <Markers marker={marker} />
          </Map>
        ) : <Text>Loading...</Text>}
      </Body>
    </>
  );
}

export default App;