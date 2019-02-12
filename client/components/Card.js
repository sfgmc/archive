import { Fragment } from 'react';
import { Block, Col, Row } from 'jsxstyle';
import { Icon, Avatar, Tooltip } from 'evergreen-ui';
import VideoThumbnail from 'react-video-thumbnail';
import Component from '@reactions/component';
import { Spacer } from './Spacer';
import { Badge } from './Badge';
import { Pin } from './Pin';
import {
  initialState,
  normalizeEntry,
  retrieveSearchResults,
} from '../lib/searchState';
import {
  mediaQueries,
  getYoutubeId,
  getYoutubeThumbnail,
  contentTypeColors,
} from '../lib/utils';

export const Card = ({ entry, onClick, isInDialog }) => {
  entry = normalizeEntry(entry)
  if (!entry.meta) { return null; }
  // console.log(entry)
  const isUnprocessed = entry.isUnprocessed;
  return (
    <Tooltip content={entry.locationName || entry.name || entry.title}>
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
        lgWidth={isInDialog ? "calc(50% - 16px)" : "calc(33% - 16px)"}
        background={isUnprocessed ? '#eee' : '#fff'}
      >
        <Row
          borderBottom={`solid 1px ${entry.contentType === 'alumni' ? 'transparent' : '#eee'}`}
          padding={8}
          height={40}
          alignItems="center"
          justifyContent="flex-start"
          width="100%"
        >
          {entry.contentType !== 'alumni' && entry.contentType !== 'locations' && <Badge color={contentTypeColors[entry.contentType]}>{entry.contentType}</Badge>}
          {entry.contentType === 'alumni' && <Avatar name={entry.name} />}
          {entry.contentType === 'locations' && <Fragment><Spacer /><Pin noTransform /><Spacer /></Fragment>}
          <Spacer />
          <Block
            width={entry.contentType === 'alumni' ? 'auto' : '100%'}
            fontWeight="bold"
            textTransform="uppercase"
            fontSize={12}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {entry.locationName || entry.name || entry.title}
          </Block>
          {entry.contentType === 'alumni' && <Row flex={1} justifyContent="flex-end">
            {entry.isFifthSection && <Fragment>
              <Badge color="red">Fifth Section</Badge>
              <Spacer />
            </Fragment>}
            {entry.status === 'current' && <Badge color="blue">Active Member</Badge>}
            {entry.status !== 'current' && <Badge color="neutral">Alumni</Badge>}
          </Row>}
        </Row>
        {entry.contentType !== 'alumni' && entry.contentType !== 'locations' && <Fragment>
          <Block
            height="calc(100% - 40px)"
            padding={8}
          >
            {entry.file && entry.type === 'image' && <Block
              component="img"
              key={entry.title}
              width="100%"
              height="auto"
              props={{
                src: entry.file
              }}
            />}
            {entry.file && entry.type === 'video' && <Component key={`video-thumbnail-state-${entry.id}`} initialState={{ imageUrl: null }}>{({ state, setState }) => (
              <Block position="relative" minHeight={200} background="black">
                <Block display="none"><VideoThumbnail
                  key={`video-thumbnail-${entry.id}`}
                  snapshotAtTime={1}
                  videoUrl={entry.file}
                  thumbnailHandler={(imageUrl) => {
                    // console.log({ imageUrl })
                    setState({ imageUrl })
                  }}
                  renderThumbnail={false}
                /></Block>
                <Block
                  component="img"
                  key={entry.title}
                  width="100%"
                  height="auto"
                  z-index={1}
                  props={{
                    src: state.imageUrl
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
            )}</Component>}
            {entry.externalUrl && entry.type === 'youtube' && <Block position="relative">
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
            </Block>}
            {entry.story && <Block
              width="100%"
              height="auto"
              maxHeight={300}
              overflow="hidden"
            >
              <p>{entry.story[0]}</p>
              <p>{entry.story[1]}</p>
              <p>{entry.story[2]}</p>
              <p>{entry.story[3]}</p>
            </Block>}
          </Block>
          <Row
            borderTop="solid 1px #eee"
            padding={8}
            height={40}
            alignItems="center"
            justifyContent="flex-start"
            width="100%"
          >
            {(entry.tags || []).map((tag, index) => tag ? (
              <Fragment key={`entry-card-tags-${entry.meta.id}-${index}`}>
                <Badge color="orange">{tag.label}</Badge>
                {index !== (entry.tags.length - 1) && <Spacer />}
              </Fragment>
            ) : null)}
            {(!entry.tags || !entry.tags.length || !entry.tags[0]) && <Badge color="neutral">Not tagged</Badge>}
          </Row>
        </Fragment>}
      </Col>
    </Tooltip>
  );
};