import { useState, memo } from 'react';
import { View, Text, useTheme } from '@aws-amplify/ui-react';
import { Marker, Popup } from "react-map-gl";
import Pin from './Pin';

const Markers = ({ trackerPositions }) => {
  const { tokens } = useTheme();

  const [popupInfo, setPopupInfo] = useState();
  if (trackerPositions.length === 0) return null;

  const handleClick = ({ longitude, latitude, time }) => {
    if (popupInfo) return;
    setPopupInfo({
      longitude,
      latitude,
      time,
    })
  }

  return (
    <>
      {popupInfo && (<Popup longitude={popupInfo.longitude} latitude={popupInfo.latitude} offset={[0, -40]} closeOnClick={false} onClose={() => setPopupInfo(null)}>
        <View padding="10px 10px">
          <Text>Time: {popupInfo.time}</Text>
          <Text>Lat: {popupInfo.latitude}</Text>
          <Text>Lon: {popupInfo.longitude}</Text>
        </View>
      </Popup>)}
      {trackerPositions.map((position, index) => (
        <Marker key={index} longitude={position.Position[0]} latitude={position.Position[1]} color="blue">
          <Pin onClick={() => handleClick({
            longitude: position.Position[0],
            latitude: position.Position[1],
            time: position.SampleTime.toISOString(),
          })} color={tokens.colors.brand.primary[60]} />
        </Marker>
      ))}
    </>);
};

export default memo(Markers);