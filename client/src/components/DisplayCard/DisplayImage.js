import { Block } from 'jsxstyle';
import React from 'react';
export const DisplayImage = ({ entry }) => {
  return (
    <Block
      component="img"
      key={entry.title}
      height="100%"
      width="100%"
      maxHeight="100%"
      maxWidth="100%"
      minHeight="100%"
      minWidth="100%"
      objectFit="cover"
      objectPosition="top center"
      props={{
        src: entry.file.url,
        height: '100%',
        width: '100%'
      }}
    />
  );
};
