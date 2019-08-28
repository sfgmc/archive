import { Block, Row } from 'jsxstyle';
import React from 'react';
import YouTube from 'react-youtube';
import { getYoutubeId } from '../../utils';
import { CollectionList } from './CollectionList';
import { log } from './index';
export const MediaYoutubeDisplay = ({
  entry,
  collections,
  onCollectionSelect
}) => {
  log('MediaYoutubeDisplay render');
  if (entry.contentType !== 'media' || entry.type !== 'youtube') {
    return null;
  }
  return (
    <Row height={500}>
      {!!collections.length && (
        <CollectionList
          collections={collections}
          onCollectionSelect={onCollectionSelect}
          currentId={entry.sys.id}
        />
      )}
      <Block flex={1} height="100%">
        <YouTube
          videoId={getYoutubeId(entry.externalUrl)} // defaults -> null
          id={null} // defaults -> null
          className={null} // defaults -> null
          containerClassName="" // defaults -> ''
          opts={{
            width: '100%',
            height: 500
          }} // defaults -> {}
          onReady={() => null} // defaults -> noop
          onPlay={() => null} // defaults -> noop
          onPause={() => null} // defaults -> noop
          onEnd={() => null} // defaults -> noop
          onError={() => null} // defaults -> noop
          onStateChange={() => null} // defaults -> noop
          onPlaybackRateChange={() => null} // defaults -> noop
          onPlaybackQualityChange={() => null} // defaults -> noop
        />
      </Block>
    </Row>
  );
};
