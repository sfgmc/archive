import { Avatar, Tooltip } from 'evergreen-ui';
import { Block, Col, Row } from 'jsxstyle';
import React, { Fragment } from 'react';
import { contentTypeColors, mediaQueries } from '../../utils';
import { Badge } from '../Badge';
import { Pin } from '../Pin';
import { Spacer } from '../Spacer';
import { DisplayImage } from './DisplayImage';
import { DisplayPeople } from './DisplayPeople';
import { DisplayVideo } from './DisplayVideo';
import { DisplayYoutube } from './DisplayYoutube';
export const useFile = null;

const entryHeights = {
  alumni: 40,
  location: 40,
  media: 384,
  stories: 384,
  ensamble: 40
};
export const DisplayCard = ({ entry, onClick, isInDialog }) => {
  // const { entry, fields = {}, meta = {}, isLoading } = useEntry(entryId);

  // const entry.contentType = meta.contentType && meta.contentType.sys.id;
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
        smWidth="100%"
        width="400px"
        lgWidth="400px"
        height={entryHeights[entry.contentType] || 40}
        flexGrow={0}
        background="#fff"
      >
        {/* {isLoading && <PlaceHolder />} */}
        <Fragment>
          <Row
            borderBottom={`solid 1px ${
              entry.contentType === 'alumni' ? 'transparent' : '#eee'
            }`}
            padding={8}
            height={40}
            alignItems="center"
            justifyContent="flex-start"
            width="100%"
          >
            {entry.contentType !== 'alumni' &&
              entry.contentType !== 'locations' && (
                <Badge color={contentTypeColors[entry.contentType]}>
                  {entry.contentType}
                </Badge>
              )}
            {entry.contentType === 'alumni' && (
              <Avatar
                name={entry.name}
                src={
                  entry.headshot &&
                  entry.headshot.file &&
                  entry.headshot.file.url
                }
              />
            )}
            {entry.contentType === 'locations' && (
              <Fragment>
                <Spacer />
                <Pin noTransform />
                <Spacer />
              </Fragment>
            )}
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
            {entry.contentType === 'alumni' && <DisplayPeople entry={entry} />}
          </Row>
          {entry.contentType !== 'alumni' && entry.contentType !== 'locations' && (
            <Fragment>
              <Block
                height={
                  entry.file && entry.type === 'image' ? 420 : 'calc(100% - 80)'
                }
                overflow="hidden"
                padding={8}
              >
                {entry.file && entry.type === 'image' && (
                  <DisplayImage entry={entry} />
                )}
                {entry.file && entry.type === 'video' && (
                  <DisplayVideo entry={entry} />
                )}
                {entry.externalUrl && entry.type === 'youtube' && (
                  <DisplayYoutube entry={entry} />
                )}
                {entry.story && (
                  <Block
                    width="100%"
                    height="auto"
                    maxHeight={300}
                    overflow="hidden"
                  >
                    <p>{entry.story[0]}</p>
                    <p>{entry.story[1]}</p>
                    <p>{entry.story[2]}</p>
                    <p>{entry.story[3]}</p>
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
                {(entry.tags || []).map((tag, index) =>
                  tag ? (
                    <Fragment key={`entry-card-tags-${entry.sys.id}-${index}`}>
                      <Badge color="orange">{tag.label}</Badge>
                      {index !== entry.tags.length - 1 && <Spacer />}
                    </Fragment>
                  ) : null
                )}
                {(!entry.tags || !entry.tags.length || !entry.tags[0]) && (
                  <Badge color="neutral">Not tagged</Badge>
                )}
              </Row>
            </Fragment>
          )}
        </Fragment>
      </Col>
    </Tooltip>
  );
};
