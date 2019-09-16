import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Block } from 'jsxstyle';
import React from 'react';
import { log } from './index';
export const StoryDisplay = ({ entry, fields, meta, collections }) => {
  log('StoryDisplay render');
  if (meta.contentType.sys.id !== 'stories') {
    return null;
  }
  return null;
  return (
    <Block
      width="100%"
      overflowY="auto"
      props={{
        contentEditable: true,
        onInput: e => {},
        onBlur: e => {},
        dangerouslySetInnerHTML: {
          __html: documentToHtmlString(entry.rawStory)
        }
      }}
    />
  );
};
