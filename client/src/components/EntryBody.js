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
import moment from 'moment';
import React, { Fragment, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import { Spacer } from '../components/Spacer';
import {
  useGetCollectionsByEntry,
  useGetEntryById,
  useGetLinkedEntriesByEntry
} from '../services/api/hooks';
import { mediaQueries } from '../utils';
import { Badge } from './Badge';
import { DisplayCard } from './DisplayCard';
import { DisplayEntry } from './DisplayEntry';

// import { useArchiveStore, useEntry } from '../lib/ArchiveStore';

const archive = null;

const ObjectFitBlock = styled(Block)`
  // & img {
  //   object-fit:contain;
  // }
  // & .magnifying-glass.circle {
  //   background-size: 550% !important;
  // }
`;

export const EntryBody = withRouter(({ contentType, entryId, history }) => {
  console.log('EntryBody');
  const [isInEditMode, setIsInEditMode] = useState(false);

  const { data: entry, error, loading } = useGetEntryById({
    entryId,
    contentType
  });

  const {
    data: linkedEntries,
    error: linkedError,
    loading: linkedLoading
  } = useGetLinkedEntriesByEntry({ entry });
  const { data: collections } = useGetCollectionsByEntry({ entry });
  // const { entry, entry = {}, entry = {} } = useEntry(entryId);

  // return null;
  return (
    <Fragment>
      {loading && <div>Loading...</div>}
      {Boolean(entry) && (
        <Col className="entryBody">
          <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
            <Pane padding={16}>
              <Heading size={600}>
                {entry.locationName || entry.name || entry.title}
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
            {(entry.contentType === 'story' ||
              entry.contentType === 'media') && (
              <Fragment>
                <InlineRow flexShrink={0}>
                  Date: {moment(entry.date).format('DD MMM YYYY')}
                </InlineRow>
                <Spacer />
              </Fragment>
            )}
            <InlineRow flexShrink={0} alignItems="center" flexWrap="wrap">
              Tags:
              <Spacer />
              {((entry.tagsCollection && entry.tagsCollection.items) || []).map(
                (tag, index) =>
                  tag ? (
                    <Badge
                      cursor="pointer"
                      color="orange"
                      marginRight={8}
                      key={`entry-body-tags-${entry.id}-${index}`}
                    >
                      {tag.label}
                    </Badge>
                  ) : null
              )}
              {(!entry.tagsCollection ||
                !entry.tagsCollection.items ||
                !entry.tagsCollection.items.length ||
                !entry.tagsCollection.items[0]) && (
                <Badge cursor="pointer" color="neutral" marginRight={8}>
                  Not Tagged
                </Badge>
              )}
            </InlineRow>
            <Spacer flex />
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
                      <Menu.Item onSelect={() => toaster.notify('Untagged')}>
                        Untagged
                      </Menu.Item>
                      <Menu.Item
                        onSelect={() => toaster.notify('Untranscribed')}
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
              collections={collections}
              entry={entry}
              onCollectionSelect={id => history.push(`/entry/${id}`)}
            />

            {!entry.accessibilityCaption && (
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
                <ResponsiveMasonry
                  columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
                >
                  <Masonry>
                    {linkedEntries.map(entryId => (
                      <DisplayCard
                        isInDialog
                        entryId={entryId}
                        onClick={() => history.push(`/entry/${entryId}`)}
                      />
                    ))}
                  </Masonry>
                </ResponsiveMasonry>
              </Fragment>
            )}
          </Block>
        </Col>
      )}
    </Fragment>
  );
  return (
    <Fragment>
      {/* {error && <div>{error.message}</div>}
      {loading && <div>Loading...</div>} */}
      {/* {isInEditMode && entry && (
        <EditBody entry={entry} exitEditMode={() => setIsInEditMode(false)} />
      )} */}
      {!isInEditMode && entry && (
        <Col className="entryBody">
          {/* <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
            <Pane padding={16}>
              <Heading size={600}>
                {entry.locationName || entry.name || entry.title}
              </Heading>
            </Pane>
          </Pane> */}
          <Row
            borderRadius={5}
            border="solid 1px #eee"
            fontSize={12}
            textTransform="uppercase"
            padding={8}
            flexWrap="wrap"
          >
            {/* {false &&
              entry.contentType &&
              (entry.contentType === 'story' ||
                entry.contentType === 'media') && (
                <Fragment>
                  <InlineRow flexShrink={0}>
                    Date: {moment(entry.date).format('DD MMM YYYY')}
                  </InlineRow>
                  <Spacer />
                </Fragment>
              )} */}
            {/* <InlineRow flexShrink={0} alignItems="center" flexWrap="wrap">
              Tags:
              <Spacer />
              {((entry.tagsCollection && entry.tagsCollection.items) || []).map(
                (tag, index) =>
                  tag ? (
                    <Badge
                      cursor="pointer"
                      color="orange"
                      marginRight={8}
                      key={`entry-body-tags-${entry.id}-${index}`}
                    >
                      {tag.label}
                    </Badge>
                  ) : null
              )}
              {(!entry.tagsCollection ||
                !entry.tagsCollection.items ||
                !entry.tagsCollection.items.length ||
                !entry.tagsCollection.items[0]) && (
                <Badge cursor="pointer" color="neutral" marginRight={8}>
                  Not Tagged
                </Badge>
              )}
            </InlineRow> */}
            <Block flex={1} />
            {/* <Row minHeight="100%" alignItems="center">
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
            </Row> */}
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
            {/* <DisplayEntry
              entry={entry}
              onCollectionSelect={id => history.push(`/entry/${id}`)}
            /> */}

            {/* {false && !entry.accessibilityCaption && (
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
            )} */}

            {/* {false && !!linkedEntries.length && (
              <Fragment>
                <hr />
                <Block>Linked Entries</Block>
                <Gallery>
                  {linkedEntries.map(entryId => (
                    <DisplayCard
                      isInDialog
                      entryId={entryId}
                      onClick={() => history.push(`/entry/${entryId}`)}
                    />
                  ))}
                </Gallery>
              </Fragment>
            )} */}
          </Block>
        </Col>
      )}
    </Fragment>
  );
});
