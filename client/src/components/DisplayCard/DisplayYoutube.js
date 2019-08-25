import { Icon } from 'evergreen-ui';
import { Block } from 'jsxstyle';
import React from 'react';
import { getYoutubeThumbnail } from '../../utils';
export const DisplayYoutube = ({ entry }) => {
  return (
    <Block position="relative">
      <Block
        component="img"
        key={entry.title}
        width="100%"
        height="auto"
        z-index={1}
        props={{
          src: getYoutubeThumbnail(entry.externalUrl)
        }}
      />
      <Block
        position="absolute"
        left="50%"
        top="50%"
        transform="translateX(-50%) translateY(-50%) scale(3)"
        z-index={2}
        opacity={0.75}
      >
        <Icon icon="play" color="muted" />
      </Block>
    </Block>
  );
};
