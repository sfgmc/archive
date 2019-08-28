import React from 'react';
import { log } from './index';
export const EnsamblesDisplay = ({ entry, fields, meta }) => {
  log('EnsamblesDisplay render');
  if (meta.contentType.sys.id !== 'ensambles') {
    return null;
  }
  return <div />;
};
