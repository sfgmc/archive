import React from 'react';
import { log } from './index';
export const EventsDisplay = ({ entry, fields, meta }) => {
  log('EventsDisplay render');
  if (meta.contentType.sys.id !== 'events') {
    return null;
  }
  return <div />;
};
