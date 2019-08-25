import { Icon } from 'evergreen-ui';
import { Block } from 'jsxstyle';
import React, { useState } from 'react';
import VideoThumbnail from 'react-video-thumbnail';
export const DisplayVideo = ({ entry }) => {
  const [imageUrl, setImageUrl] = useState('');
  const file = {};
  return (
    <Block position="relative" minHeight={200} background="black">
      <Block display="none">
        <VideoThumbnail
          key={`video-thumbnail-${entry.id}`}
          snapshotAtTime={1}
          videoUrl={entry.file.url}
          thumbnailHandler={imageUrl => {
            // console.log({ imageUrl })
            setImageUrl(imageUrl);
          }}
          renderThumbnail={false}
        />
      </Block>
      <Block
        component="img"
        key={entry.title}
        width="100%"
        height="auto"
        z-index={1}
        props={{
          src: imageUrl
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
