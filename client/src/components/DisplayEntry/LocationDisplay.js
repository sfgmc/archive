import GoogleMapReact from 'google-map-react';
import { Block } from 'jsxstyle';
import React from 'react';
import { Pin } from '../Pin';
import { googleMapsAPItoken, log } from './index';
export const LocationDisplay = ({ entry, fields, meta }) => {
  log('LocationDisplay render');
  if (meta.contentType.sys.id !== 'locations') {
    return null;
  }
  return (
    <Block width="100%" height={300}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: googleMapsAPItoken }}
        defaultCenter={{
          lat: fields.geolocation.lat,
          lng: fields.geolocation.lon
        }}
        defaultZoom={12}
      >
        <Pin lat={fields.geolocation.lat} lng={fields.geolocation.lon} />
      </GoogleMapReact>
    </Block>
  );
};
