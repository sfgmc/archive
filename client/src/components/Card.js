import React, { Fragment, useState, useEffect } from 'react';
import { Block, Col, Row } from 'jsxstyle';
import { Icon, Avatar, Tooltip } from 'evergreen-ui';
import VideoThumbnail from 'react-video-thumbnail';
import { Spacer } from './Spacer';
import { Badge } from './Badge';
import { Pin } from './Pin';
// import { initialState, normalizeEntry, retrieveSearchResults } from '../lib/searchState';
// import { mediaQueries, getYoutubeId, getYoutubeThumbnail, contentTypeColors } from '../lib/utils';
// import { useFile } from '../utils/useFile';
// import { useArchiveStore } from '../lib/ArchiveStore';
// import { getFields, getMeta } from '../utils/selectors';
// import { useEntry } from '../utils/useEntry';

import ContentLoader from 'react-content-loader';
const useFile = null;
const getYoutubeThumbnail = null;
const useEntry = null;
const mediaQueries = null;
const contentTypeColors = null;

const PlaceHolder = ({ width = 200, height = 200 }) => (
  <ContentLoader speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb" {...{ width, height }}>
    <rect x="0" y="70" rx="5" ry="5" {...{ width, height }} />
  </ContentLoader>
);

export const DisplayImage = ({ entry }) => {
  const { file } = useFile(entry.fields.file);
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
        src: file.url,
        height: '100%',
        width: '100%',
      }}
    />
  );
};

const DisplayVideo = ({ entry }) => {
  const [imageUrl, setImageUrl] = useState('');
  // const { file } = useFile(entry.fields.file);
  return null;
  const file = {}
  return (
    <Block position="relative" minHeight={200} background="black">
      <Block display="none">
        <VideoThumbnail
          key={`video-thumbnail-${entry.id}`}
          snapshotAtTime={1}
          videoUrl={file.url}
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
          src: imageUrl,
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

const DisplayYoutube = ({ entry }) => {
  return (
    <Block position="relative">
      <Block
        component="img"
        key={entry.fields.title}
        width="100%"
        height="auto"
        z-index={1}
        props={{
          src: getYoutubeThumbnail(entry.fields.externalUrl),
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

export const DisplayPeople = ({ entry }) => {
  return (
    <Row flex={1} justifyContent="flex-end">
      {entry.fields.isFifthSection && (
        <Fragment>
          <Badge color="red">Fifth Section</Badge>
          <Spacer />
        </Fragment>
      )}
      {entry.fields.status === 'current' && <Badge color="blue">Active Member</Badge>}
      {entry.fields.status !== 'current' && <Badge color="neutral">Alumni</Badge>}
    </Row>
  );
};

export const Card = ({ entryId, onClick, isInDialog }) => {
  const { entry, fields = {}, meta = {}, isLoading } = useEntry(entryId);

  const contentId = meta.contentType && meta.contentType.sys.id;
  return (
    <Tooltip content={fields.locationName || fields.name || fields.title}>
      <Col
        borderRadius={5}
        border="solid 1px #eee"
        boxShadow="2px 2px 2px 2px rgba(0,0,0,0)"
        margin={8}
        cursor="pointer"
        hoverBorderColor="#bbb"
        hoverBoxShadow="0 0 10px 0 rgba(0,0,0,0.25)"
        transition="border-color .3s linear, box-shadow .3s linear"
        props={{ onClick }}
        mediaQueries={mediaQueries}
        smWidth="calc(100% - 16px)"
        width="calc(50% - 16px)"
        lgWidth={isInDialog ? 'calc(25% - 16px)' : 'calc(33% - 16px)'}
        maxHeight={500}
        background="#fff"
      >
        {isLoading && <PlaceHolder />}
        {!isLoading && (
          <Fragment>
            <Row
              borderBottom={`solid 1px ${contentId === 'alumni' ? 'transparent' : '#eee'}`}
              padding={8}
              height={40}
              alignItems="center"
              justifyContent="flex-start"
              width="100%"
            >
              {contentId !== 'alumni' && contentId !== 'locations' && (
                <Badge color={contentTypeColors[contentId]}>{contentId}</Badge>
              )}
              {contentId === 'alumni' && <Avatar name={fields.name} src={fields.headshot} />}
              {contentId === 'locations' && (
                <Fragment>
                  <Spacer />
                  <Pin noTransform />
                  <Spacer />
                </Fragment>
              )}
              <Spacer />
              <Block
                width={contentId === 'alumni' ? 'auto' : '100%'}
                fontWeight="bold"
                textTransform="uppercase"
                fontSize={12}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {fields.locationName || fields.name || fields.title}
              </Block>
              {contentId === 'alumni' && <DisplayPeople entry={entry} />}
            </Row>
            {contentId !== 'alumni' && contentId !== 'locations' && (
              <Fragment>
                <Block
                  height={fields.file && fields.type === 'image' ? 420 : 'calc(100% - 80)'}
                  overflow="hidden"
                  padding={8}
                >
                  {fields.file && fields.type === 'image' && <DisplayImage entry={entry} />}
                  {fields.file && fields.type === 'video' && <DisplayVideo entry={entry} />}
                  {fields.externalUrl && fields.type === 'youtube' && <DisplayYoutube entry={entry} />}
                  {fields.story && (
                    <Block width="100%" height="auto" maxHeight={300} overflow="hidden">
                      <p>{fields.story[0]}</p>
                      <p>{fields.story[1]}</p>
                      <p>{fields.story[2]}</p>
                      <p>{fields.story[3]}</p>
                    </Block>
                  )}
                </Block>
                <Row
                  borderTop="solid 1px #eee"
                  padding={8}
                  height={40}
                  alignItems="center"
                  justifyContent="flex-start"
                  width="100%"
                >
                  {(fields.tags || []).map((tag, index) =>
                    tag ? (
                      <Fragment key={`entry-card-tags-${meta.id}-${index}`}>
                        <Badge color="orange">{tag.label}</Badge>
                        {index !== fields.tags.length - 1 && <Spacer />}
                      </Fragment>
                    ) : null,
                  )}
                  {(!fields.tags || !fields.tags.length || !fields.tags[0]) && (
                    <Badge color="neutral">Not tagged</Badge>
                  )}
                </Row>
              </Fragment>
            )}
          </Fragment>
        )}
      </Col>
    </Tooltip>
  );
};
