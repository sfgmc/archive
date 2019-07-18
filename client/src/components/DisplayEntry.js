import React, { Fragment, useEffect, useState } from 'react';

import { Block, Col, Row, InlineRow } from 'jsxstyle';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import ReactPlayer from 'react-player';
import * as moment from 'moment';
import ReactImageMagnify from 'react-image-magnify';
import YouTube from 'react-youtube';
import GoogleMapReact from 'google-map-react';
import styled from 'styled-components';

import { Alert, Icon, Pane, Tablist, SidebarTab, Heading } from 'evergreen-ui';

import { Pin } from './Pin';
import { Spacer } from './Spacer';

const log = null;
const meta = null;
const fields = null;
const headshot = null;
const googleMapsAPItoken = null;
const file = null;
const getYoutubeId = null;

// import { googleMapsAPItoken } from '../lib/googleMaps';
// import { getYoutubeId, log } from '../utils';
// import { getFields, getMeta } from '../utils/selectors';

// import { useFile } from '../utils/useFile';

// import { client } from '../lib/contentful';

const TabCol = styled(Col)`
  & span {
    display: block;
    &:focus {
      outline: 0;
    }
  }
  & * {
    box-sizing: border-box;
  }
`;

export const DisplayEntry = ({ entry, onCollectionSelect }) => {
  log('DisplayEntry render', entry);
  if (!entry) {
    return null;
  }

  // const fields = getFields(entry) || {};
  // const meta = getMeta(entry) || {};

  // if (!meta.contentType) {
  //   return null;
  // }

  const entryDisplay =
    meta.contentType.sys.id === 'media' ? DisplayTypes.media[fields.type] : DisplayTypes[meta.contentType.sys.id];
  if (!entryDisplay) {
    return null;
  }

  // useCollections(collectionsList)
  const [collections, setCollections] = useState([]);
  // useEffect(() => {
  //   if (fields.collections) {
  //     // getCollection
  //     (async collections => {
  //       const collectionsStore = [];
  //       for (const coll of collections) {
  //         const collection = await client.getEntry(coll.sys.id);
  //         const children = await client.getEntries({
  //           content_type: 'media',
  //           'fields.collections.sys.id': coll.sys.id,
  //         });
  //         collectionsStore.push({
  //           collection,
  //           children: children.items,
  //         });
  //       }
  //       return collectionsStore;
  //       // endGetCollection
  //     })(fields.collections).then(results => {
  //       setCollections(results);
  //     });
  //   }
  // }, [fields.collections]);
  console.log('collections', collections);
  // end useCollections

  const { Display } = entryDisplay;

  return (
    <Block width="100%" flex={1} flexShrink={0} overflowY="auto" padding={16}>
      <Display
        entry={entry}
        fields={fields}
        meta={meta}
        collections={collections}
        onCollectionSelect={onCollectionSelect}
      />
    </Block>
  );
};

const PeopleDisplay = ({ entry, fields, meta }) => {
  log('PeopleDisplay render', fields);
  // const { file: headshot } = useFile(fields.headshot);
  log('headshot', headshot);
  return (
    <Row>
      <Col alignItems="center" justifyContent="center" flexShrink={0}>
        <Block
          width={200}
          height={200}
          backgroundColor="#ddd"
          borderRadius={5}
          backgroundImage={`url(${headshot.url || '/static/images/generic-profile.svg'})`}
          backgroundSize={fields.headshot ? 'cover' : '75%'}
          backgroundPosition="center center"
          backgroundRepeat="no-repeat"
        />
      </Col>
      <Spacer size={18} />
      <Col flexShrink={0} flex={1}>
        <Heading size={600}>{fields.name}</Heading>
        <Block flex={1} />
        <Row justifyContent="space-between">
          <Block>Status:</Block>
          <Block>{fields.status}</Block>
        </Row>
        {fields.dateOfJoin && (
          <Row justifyContent="space-between">
            <Block>Date of Join: </Block>
            <Block>{moment(fields.dateOfJoin).format('MMMM YYYY')}</Block>
          </Row>
        )}
        {fields.dateOfLeave && (
          <Row justifyContent="space-between">
            <Block>Date of Leave: </Block>
            <Block>{moment(fields.dateOfLeave).format('MMMM YYYY')}</Block>
          </Row>
        )}
        {fields.dateOfDeath && (
          <Row justifyContent="space-between">
            <Block>Date of Death: </Block>
            <Block>{moment(fields.dateOfDeath).format('MMMM YYYY')}</Block>
          </Row>
        )}
        {fields.barObituaryLink && (
          <Row justifyContent="space-between">
            <Block>
              <a target="_blank" href={fields.barObituaryLink}>
                BAR Obituary
              </a>
            </Block>
          </Row>
        )}
        {fields.isFifthSection && fields.chorusNumber && (
          <Row justifyContent="space-between">
            <Block>Chorus Number: </Block>
            <Block>{fields.chorusNumber}</Block>
          </Row>
        )}
        <Row />
      </Col>
      <Spacer />
    </Row>
  );
};

const LocationDisplay = ({ entry, fields, meta }) => {
  log('LocationDisplay render');
  if (meta.contentType.sys.id !== 'locations') {
    return null;
  }
  return (
    <Block width="100%" height={300}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: googleMapsAPItoken }}
        defaultCenter={{
          lat: fields.geolocation.lat,
          lng: fields.geolocation.lon,
        }}
        defaultZoom={12}
      >
        <Pin lat={fields.geolocation.lat} lng={fields.geolocation.lon} />
      </GoogleMapReact>
    </Block>
  );
};
const StoryDisplay = ({ entry, fields, meta, collections }) => {
  log('StoryDisplay render');
  if (meta.contentType.sys.id !== 'stories') {
    return null;
  }
  return null;
  return (
    <Block
      width="100%"
      overflowY="auto"
      props={{
        contentEditable: true,
        onInput: e => {
          console.log(e);
        },
        onBlur: e => {
          console.log(e);
        },
        dangerouslySetInnerHTML: {
          __html: documentToHtmlString(entry.rawStory),
        },
      }}
    />
  );
};
const MediaImageDisplay = ({ entry, fields, meta, collections, onCollectionSelect }) => {
  log('MediaImageDisplay render');
  // const { file } = useFile(fields.file);
  log('file', file);
  return (
    <Row>
      {!!collections.length && (
        <CollectionList collections={collections} onCollectionSelect={onCollectionSelect} currentId={meta.id} />
      )}
      <Block flex={1} padding={8}>
        <ReactImageMagnify
          {...{
            style: {
              maxWidth: '50%',
            },
            smallImage: {
              alt: fields.title,
              isFluidWidth: true,
              src: file.url,
            },
            largeImage: {
              src: file.url,
              width: file.details && file.details.image.width,
              height: file.details && file.details.image.height,
            },
            isHintEnabled: true,
            shouldHideHintAfterFirstActivation: false,
          }}
        />
      </Block>
    </Row>
  );
};
const MediaVideoFileDisplay = ({ entry, fields, meta, collections }) => {
  log('MediaVideoFileDisplay render');
  if (meta.contentType.sys.id !== 'media' || fields.type !== 'video') {
    return null;
  }
  return (
    <Block flex={1}>
      <ReactPlayer url={fields.file} controls width="100%" />
    </Block>
  );
};
const MediaYoutubeDisplay = ({ entry, fields, meta, collections, onCollectionSelect }) => {
  log('MediaYoutubeDisplay render');
  if (meta.contentType.sys.id !== 'media' || fields.type !== 'youtube') {
    return null;
  }
  return (
    <Row height="80vh">
      {!!collections.length && (
        <CollectionList collections={collections} onCollectionSelect={onCollectionSelect} currentId={meta.id} />
      )}
      <Block flex={1} height="100%">
        <YouTube
          videoId={getYoutubeId(fields.externalUrl)} // defaults -> null
          id={null} // defaults -> null
          className={null} // defaults -> null
          containerClassName="" // defaults -> ''
          opts={{
            width: '100%',
            height: '100%',
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
const MediaSpotifyDisplay = ({ entry, fields, meta, collections }) => {
  log('MediaSpotifyDisplay render');
  if (meta.contentType.sys.id !== 'media' || fields.type !== 'spotify') {
    return null;
  }
  return <div />;
};
const EventsDisplay = ({ entry, fields, meta }) => {
  log('EventsDisplay render');
  if (meta.contentType.sys.id !== 'events') {
    return null;
  }
  return <div />;
};
const EnsamblesDisplay = ({ entry, fields, meta }) => {
  log('EnsamblesDisplay render');
  if (meta.contentType.sys.id !== 'ensambles') {
    return null;
  }
  return <div />;
};
const TagsDisplay = ({ entry, fields, meta }) => {
  log('TagsDisplay render');
  if (meta.contentType.sys.id !== 'tags') {
    return null;
  }
  return <div />;
};

const CollectionList = ({ collections, onCollectionSelect, currentId }) => (
  <Fragment>
    <TabCol height="100%" width={200} padding={4} overflowY="auto">
      <SidebarTab
        display="block"
        key="CollectionTitle"
        id="CollectionTitle"
        aria-controls={`panel-collectiontitle`}
        pointerEvents="none"
      >
        <Block
          fontSize={15}
          fontWeight="bold"
          whiteSpace="nowrap"
          width="100%"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          Collections
        </Block>
      </SidebarTab>
      {collections.map(collection => (
        <Fragment>
          <SidebarTab
            display="block"
            key={collection.collection.sys.id}
            id={collection.collection.sys.id}
            aria-controls={`panel-${collection.collection.sys.id}`}
            pointerEvents="none"
          >
            <Block fontWeight="bold" whiteSpace="nowrap" width="100%" overflow="hidden" textOverflow="ellipsis">
              {collection.collection.fields.title}
            </Block>
          </SidebarTab>
          {collection.children.map(child => (
            <SidebarTab
              width="100%"
              key={child.sys.id}
              id={child.sys.id}
              onSelect={() => onCollectionSelect(child.sys.id)}
              isSelected={child.sys.id === currentId}
              aria-controls={`panel-${child.sys.id}`}
              pointerEvents={child.sys.id === currentId ? 'none' : undefined}
            >
              <Block whiteSpace="nowrap" width="100%" overflow="hidden" textOverflow="ellipsis" padding={4}>
                {child.fields.title}
              </Block>
            </SidebarTab>
          ))}
        </Fragment>
      ))}
    </TabCol>
    <Spacer />
  </Fragment>
);

const DisplayTypes = {
  alumni: { Display: PeopleDisplay },
  locations: { Display: LocationDisplay },
  stories: { Display: StoryDisplay },
  media: {
    image: { Display: MediaImageDisplay },
    video: { Display: MediaVideoFileDisplay },
    youtube: { Display: MediaYoutubeDisplay },
    spotify: { Display: MediaSpotifyDisplay },
  },
  events: { Display: EventsDisplay },
  ensambles: { Display: EnsamblesDisplay },
  tags: { Display: TagsDisplay },
};
