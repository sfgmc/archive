import { Block } from 'jsxstyle';
import React from 'react';
import ReactPlayer from 'react-player';
import { log } from './index';
export const MediaVideoFileDisplay = ({ entry, fields, meta, collections }) => {
  log('MediaVideoFileDisplay render');
  if (meta.contentType.sys.id !== 'media' || fields.type !== 'video') {
    return null;
  }
  return (
    <Block flex={1}>
      <ReactPlayer url={fields.file} controls width="100%" />
    </Block>
  );
};
