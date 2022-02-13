import { memo } from 'react';
import { useTheme } from '@aws-amplify/ui-react';
import { Marker } from "react-map-gl";
import Pin from './Pin';

const Markers = ({ marker }) => {
  const { tokens } = useTheme();

  if (!marker) return null;

  return (
    <>
      <Marker longitude={marker.toArray()[0]} latitude={marker.toArray()[1]} color="blue">
        <Pin color={tokens.colors.brand.primary[60]} />
      </Marker>
    </>);
};

export default memo(Markers);