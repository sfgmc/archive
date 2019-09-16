import { Block, Col } from 'jsxstyle';
import React from 'react';
import styled from 'styled-components';
import { EnsamblesDisplay } from './EnsamblesDisplay';
import { EventsDisplay } from './EventsDisplay';
import { LocationDisplay } from './LocationDisplay';
import { MediaImageDisplay } from './MediaImageDisplay';
import { MediaSpotifyDisplay } from './MediaSpotifyDisplay';
import { MediaVideoFileDisplay } from './MediaVideoFileDisplay';
import { MediaYoutubeDisplay } from './MediaYoutubeDisplay';
import { PeopleDisplay } from './PeopleDisplay';
import { StoryDisplay } from './StoryDisplay';
import { TagsDisplay } from './TagsDisplay';

export const log = () => null;
const meta = null;
const fields = null;
export const headshot = null;
export const googleMapsAPItoken = null;
export const file = null;

// import { googleMapsAPItoken } from '../lib/googleMaps';
// import { getYoutubeId, log } from '../utils';
// import { getFields, getMeta } from '../utils/selectors';

// import { useFile } from '../utils/useFile';

// import { client } from '../lib/contentful';

export const TabCol = styled(Col)`
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

export const DisplayEntry = ({ entry, collections, onCollectionSelect }) => {
  log('DisplayEntry render', entry);
  if (!entry) {
    return null;
  }

  const entryDisplay =
    entry.contentType === 'media'
      ? DisplayTypes.media[entry.type]
      : DisplayTypes[entry.contentType];

  if (!entryDisplay) {
    return null;
  }

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

const DisplayTypes = {
  alumni: { Display: PeopleDisplay },
  locations: { Display: LocationDisplay },
  stories: { Display: StoryDisplay },
  media: {
    image: { Display: MediaImageDisplay },
    video: { Display: MediaVideoFileDisplay },
    youtube: { Display: MediaYoutubeDisplay },
    spotify: { Display: MediaSpotifyDisplay }
  },
  events: { Display: EventsDisplay },
  ensambles: { Display: EnsamblesDisplay },
  tags: { Display: TagsDisplay }
};
