import { Block, Row } from 'jsxstyle';
import React from 'react';
import ReactImageMagnify from 'react-image-magnify';
import { CollectionList } from './CollectionList';
import { file, log } from './index';
export const MediaImageDisplay = ({
  entry,
  fields,
  meta,
  collections,
  onCollectionSelect
}) => {
  log('MediaImageDisplay render');
  // const { file } = useFile(fields.file);
  log('file', file);
  return (
    <Row>
      {!!collections.length && (
        <CollectionList
          collections={collections}
          onCollectionSelect={onCollectionSelect}
          currentId={meta.id}
        />
      )}
      <Block flex={1} padding={8}>
        <ReactImageMagnify
          {...{
            style: {
              maxWidth: '50%'
            },
            smallImage: {
              alt: fields.title,
              isFluidWidth: true,
              src: file.url
            },
            largeImage: {
              src: file.url,
              width: file.details && file.details.image.width,
              height: file.details && file.details.image.height
            },
            isHintEnabled: true,
            shouldHideHintAfterFirstActivation: false
          }}
        />
      </Block>
    </Row>
  );
};
