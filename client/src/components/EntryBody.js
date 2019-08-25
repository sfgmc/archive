import {
  Alert,
  Heading,
  Icon,
  Menu,
  Pane,
  Popover,
  Position,
  toaster,
  Tooltip
} from 'evergreen-ui';
import { Block, Col, InlineRow, Row } from 'jsxstyle';
import * as moment from 'moment';
import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { Badge } from '../components/Badge';
import { Gallery } from '../components/Gallery';
import { Spacer } from '../components/Spacer';
// import { normalizeEntry } from '../lib/searchState';
// import { googleMapsAPItoken } from '../lib/googleMaps';
// import { mediaQueries, getYoutubeId } from '../lib/utils';
import { DisplayEntry } from './DisplayEntry';
import { EditBody } from './EditBody';

// import { useArchiveStore, useEntry } from '../lib/ArchiveStore';

const mediaQueries = null;
const entry = null;
const fields = null;
const meta = null;
const archive = null;

const ObjectFitBlock = styled(Block)`
  // & img {
  //   object-fit:contain;
  // }
  // & .magnifying-glass.circle {
  //   background-size: 550% !important;
  // }
`;

export const EntryBody = ({ entryId }) => {
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [linkedEntries, setLinkedEntries] = useState([]);

  // const archive = useArchiveStore();

  // const { entry, fields = {}, meta = {} } = useEntry(entryId);

  console.log(entry, fields, meta);
  return (
    <Fragment>
      {isInEditMode && (
        <EditBody entry={entry} exitEditMode={() => setIsInEditMode(false)} />
      )}
      {!isInEditMode && (
        <Col className="entryBody">
          <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
            <Pane padding={16}>
              <Heading size={600}>
                {fields.locationName || fields.name || fields.title}
              </Heading>
            </Pane>
          </Pane>
          <Row
            borderRadius={5}
            border="solid 1px #eee"
            fontSize={12}
            textTransform="uppercase"
            padding={8}
            flexWrap="wrap"
          >
            {meta.contentType &&
              (meta.contentType.sys.id === 'story' ||
                meta.contentType.sys.id === 'media') && (
                <Fragment>
                  <InlineRow flexShrink={0}>
                    Date: {moment(fields.date).format('DD MMM YYYY')}
                  </InlineRow>
                  <Spacer />
                </Fragment>
              )}
            <InlineRow flexShrink={0} alignItems="center" flexWrap="wrap">
              Tags:
              <Spacer />
              {(fields.tags || []).map((tag, index) =>
                tag ? (
                  <Badge
                    cursor="pointer"
                    color="orange"
                    marginRight={8}
                    key={`entry-body-tags-${meta.id}-${index}`}
                  >
                    {tag.label}
                  </Badge>
                ) : null
              )}
              {(!fields.tags || !fields.tags.length || !fields.tags[0]) && (
                <Badge cursor="pointer" color="neutral" marginRight={8}>
                  Not Tagged
                </Badge>
              )}
            </InlineRow>
            <Block flex={1} />
            <Row minHeight="100%" alignItems="center">
              <Tooltip content="Suggest an Edit">
                <Icon
                  icon="edit"
                  color="gray"
                  cursor="pointer"
                  onClick={() => setIsInEditMode(true)}
                />
              </Tooltip>
              <Spacer />
              <Popover
                position={Position.BOTTOM_RIGHT}
                content={
                  <Menu>
                    <Menu.Group title="Flag as...">
                      <Menu.Item
                        onSelect={() => toaster.notify('Inappropriate')}
                      >
                        Inappropriate
                      </Menu.Item>
                      <Menu.Item onSelect={() => toaster.notify('Incomplete')}>
                        Incomplete
                      </Menu.Item>
                      <Menu.Item
                        onSelect={() => toaster.notify('Untagged')}
                        secondaryText="⌘R"
                      >
                        Untagged
                      </Menu.Item>
                      <Menu.Item
                        onSelect={() => toaster.notify('Untranscribed')}
                        secondaryText="⌘R"
                      >
                        Untranscribed
                      </Menu.Item>
                    </Menu.Group>
                  </Menu>
                }
              >
                <Icon icon="flag" color="gray" cursor="pointer" />
              </Popover>
            </Row>
          </Row>
          <Spacer />
          <Block
            width="100%"
            flex={1}
            flexShrink={0}
            overflowY="auto"
            mediaQueries={mediaQueries}
            smHeight="80vh"
            padding={16}
          >
            <DisplayEntry
              entry={entry}
              onCollectionSelect={id => archive.methods.setActiveEntry(id)}
            />

            {!fields.accessibilityCaption && (
              <Alert
                intent="warning"
                title="This media has not been fully transcribed"
                marginBottom={32}
              >
                <Row alignItems="center">
                  <Block flex={1} fontSize={12} color="#999" lineHeight="12px">
                    We strive to have all media in our archive accessible, both
                    to searches as well as to those who use screen-reading
                    technology. If you have a couple minutes, we could really
                    use your help in assisting the automated transcription of
                    this media.
                  </Block>
                  <Col flexShrink={0}>
                    <Block
                      component="button"
                      height={75}
                      width={100}
                      background="linear-gradient(to bottom, #EE9913, #D9822B)"
                      borderRadius={5}
                      color="white"
                      cursor="pointer"
                    >
                      <Icon icon="edit" color="white" />
                      <br />
                      Help transcribe this media
                    </Block>
                  </Col>
                </Row>
              </Alert>
            )}

            {!!linkedEntries.length && (
              <Fragment>
                <hr />
                <Block>Linked Entries</Block>
                <Gallery>
                  {linkedEntries.map(entryId => (
                    <Card
                      isInDialog
                      entryId={entryId}
                      onClick={() => archive.methods.setActiveEntry(entryId)}
                    />
                  ))}
                </Gallery>
              </Fragment>
            )}
          </Block>
        </Col>
      )}
    </Fragment>
  );
};
