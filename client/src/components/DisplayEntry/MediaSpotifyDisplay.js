import React from 'react';
import { log } from './index';
export const MediaSpotifyDisplay = ({ entry, fields, meta, collections }) => {
  log('MediaSpotifyDisplay render');
  if (meta.contentType.sys.id !== 'media' || fields.type !== 'spotify') {
    return null;
  }
  return <div />;
};
