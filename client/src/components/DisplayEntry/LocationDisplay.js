import GoogleMapReact from 'google-map-react';
import { Block } from 'jsxstyle';
import React from 'react';
import { Pin } from '../Pin';
import { googleMapsAPItoken } from './.env';
export const LocationDisplay = ({ entry }) => {
  console.log('LocationDisplay render', entry);
  if (entry.contentType.sys.id !== 'locations') {
    return null;
  }
  return (
    <Block width="100%" height={300}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: googleMapsAPItoken }}
        defaultCenter={{
          lat: entry.geolocation.lat,
          lng: entry.geolocation.lon
        }}
        defaultZoom={12}
      >
        <Pin lat={entry.geolocation.lat} lng={entry.geolocation.lon} />
      </GoogleMapReact>
    </Block>
  );
};
