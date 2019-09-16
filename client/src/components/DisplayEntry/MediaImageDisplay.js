import { Block, Row } from 'jsxstyle';
import React from 'react';
import ReactImageMagnify from 'react-image-magnify';
import { CollectionList } from './CollectionList';
import { file, log } from './index';
export const MediaImageDisplay = ({
  entry,
  meta,
  collections,
  onCollectionSelect
}) => {
  log('MediaImageDisplay render');
  // const { file } = useFile(entry.file);
  log('file', file);

  return (
    <Row>
      {!!collections.length && (
        <CollectionList
          collections={collections}
          onCollectionSelect={onCollectionSelect}
          currentId={entry.sys.id}
        />
      )}
      <Block flex={1} padding={8}>
        <ReactImageMagnify
          {...{
            style: {
              maxWidth: '50%'
            },
            smallImage: {
              alt: entry.title,
              isFluidWidth: true,
              src: entry.file.url
            },
            largeImage: {
              src: entry.file.url,
              width: entry.file.details && entry.file.details.image.width,
              height: entry.file.details && entry.file.details.image.height
            },
            isHintEnabled: true,
            shouldHideHintAfterFirstActivation: false
          }}
        />
      </Block>
    </Row>
  );
};
