import React from 'react';
import { log } from './index';
export const TagsDisplay = ({ entry, fields, meta }) => {
  log('TagsDisplay render');
  if (meta.contentType.sys.id !== 'tags') {
    return null;
  }
  return <div />;
};
