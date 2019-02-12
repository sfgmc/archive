import { Fragment } from 'react';

import { Block, Col, Row, InlineRow } from 'jsxstyle';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import ReactPlayer from 'react-player'
import { Gallery } from '../components/Gallery';
import * as moment from 'moment';
import Component from '@reactions/component'
import Magnifier from 'react-magnifier';
import YouTube from 'react-youtube';
import * as queryString from 'query-string';
import Router from 'next/router'
import GoogleMapReact from 'google-map-react';

import { Badge } from '../components/Badge';
import { Pin } from '../components/Pin';
import { Spacer } from '../components/Spacer';
import { Card } from '../components/Card';
import {
  normalizeEntry,
} from '../lib/searchState';

import { getEntry } from '../lib/contentful';
import { googleMapsAPItoken } from '../lib/googleMaps';
import {
  mediaQueries,
  getYoutubeId,
} from '../lib/utils';

const entryBodyMount = (entry) => async ({ state, setState }) => {
  entry = normalizeEntry(entry)

  const stringUrlParams = window.location.search;
  const urlParams = queryString.parse(stringUrlParams);
  urlParams.entry = entry.meta.id;
  const convertedUrlParams = queryString.stringify(urlParams);
  const href = `/?${convertedUrlParams}`;
  Router.push(href, href, { shallow: true });
}

const entryBodyUnmount = (entry) => () => {
  entry = normalizeEntry(entry)

  const stringUrlParams = window.location.search;
  const urlParams = queryString.parse(stringUrlParams);
  if (urlParams.entry === entry.meta.id) {
    delete urlParams.entry
  }
  const convertedUrlParams = queryString.stringify(urlParams);
  const href = `/?${convertedUrlParams}`;
  Router.push(href, href, { shallow: true });
}



const openNewEntry = (entryId, closeOldEntry, setInitial) => (e) => {
  // console.log('opening', entryId);
  closeOldEntry()
    .then(() => getEntry(entryId))
    .then((entry) => {
      setTimeout(() => setInitial(entry), 50)
    });
}

export const EntryBody = ({ entry, closeEntry, setInitial }) => {
  entry = normalizeEntry(entry)
  return (
    <Component didMount={entryBodyMount(entry)} willUnmount={entryBodyUnmount(entry)}>
      <Col className="entryBody">
        <Row
          borderRadius={5}
          border="solid 1px #eee"
          fontSize={12}
          textTransform="uppercase"
          padding={8}
          flexWrap="wrap"
        >
          {(entry.contentType === 'story' || entry.contentType === 'media') && <Fragment>
            <InlineRow flexShrink={0}>
              Date: {moment(entry.date).format('DD MMM YYYY')}
            </InlineRow>
            <Spacer />
          </Fragment>}
          <InlineRow
            flexShrink={0}
            alignItems="center"
            flexWrap="wrap"
          >
            Tags:
            <Spacer />
            {(entry.tags || []).map((tag, index) => tag ? (
              <Badge cursor="pointer" color="orange" marginRight={8} key={`entry-body-tags-${entry.meta.id}-${index}`}>{tag.label}</Badge>
            ) : null)}
            {(!entry.tags || !entry.tags.length || !entry.tags[0]) && <Badge cursor="pointer" color="neutral" marginRight={8}>Not Tagged</Badge>}
          </InlineRow>
        </Row>
        <Spacer />
        <Block
          width="100%"
          flex={1}
          flexShrink={0}
          overflowY="auto"
          mediaQueries={mediaQueries}
          smHeight="80vh"
        >
          {entry.contentType === 'alumni' && <Row>
            <Col alignItems="center" justifyContent="center" flexShrink={0}>
              <Block
                width={200}
                height={200}
                backgroundColor="#ddd"
                borderRadius={5}
                backgroundImage="url(/static/images/generic-profile.svg)"
                backgroundSize="75%"
                backgroundPosition="center center"
                backgroundRepeat="no-repeat"
              />
            </Col>
            <Spacer />
            <Col flexShrink={0} flex={1}>
              <Row justifyContent="space-between">
                <Block>Status:</Block>
                <Block>{entry.status}</Block>
              </Row>
              {entry.dateOfJoin && <Row justifyContent="space-between">
                <Block>Date of Join: </Block>
                <Block>{moment(entry.dateOfJoin).format('MMMM YYYY')}</Block>
              </Row>}
              {entry.dateOfLeave && <Row justifyContent="space-between">
                <Block>Date of Leave: </Block>
                <Block>{moment(entry.dateOfLeave).format('MMMM YYYY')}</Block>
              </Row>}
              {entry.dateOfDeath && <Row justifyContent="space-between">
                <Block>Date of Death: </Block>
                <Block>{moment(entry.dateOfDeath).format('MMMM YYYY')}</Block>
              </Row>}
              {entry.barObituaryLink && <Row justifyContent="space-between">
                <Block><a target="_blank" href={entry.barObituaryLink}>BAR Obituary</a></Block>
              </Row>}
              {entry.isFifthSection && entry.chorusNumber && <Row justifyContent="space-between">
                <Block>Chorus Number: </Block>
                <Block>{entry.chorusNumber}</Block>
              </Row>}
              <Row></Row>
            </Col>
            <Spacer />
          </Row>}
          {entry.geolocation && <Block
            width="100%"
            height={300}
          >
            <GoogleMapReact
              bootstrapURLKeys={{ key: googleMapsAPItoken }}
              defaultCenter={{
                lat: entry.geolocation.lat,
                lng: entry.geolocation.lon,
              }}
              defaultZoom={12}
            >
              <Pin
                lat={entry.geolocation.lat}
                lng={entry.geolocation.lon}
              />
            </GoogleMapReact>
          </Block>}
          {entry.story && <Block
            width="100%"
            overflowY="auto"
            props={{
              dangerouslySetInnerHTML: {
                __html: documentToHtmlString(entry.rawStory),
              },
            }}
          />
          }
          {entry.file && entry.type === 'image' && <Block flex={1}><Magnifier
            src={entry.file}
            width="100%"
          /></Block>}
          {entry.file && entry.type === 'video' && <Block flex={1}>
            <ReactPlayer url={entry.file} controls width="100%" />
          </Block>}
          {entry.externalUrl && entry.type === 'youtube' && <Block flex={1}>
            <YouTube
              videoId={getYoutubeId(entry.externalUrl)}                  // defaults -> null
              id={null}                       // defaults -> null
              className={null}                // defaults -> null
              containerClassName=""       // defaults -> ''
              opts={{
                width: '100%',
              }}                        // defaults -> {}
              onReady={() => null}                    // defaults -> noop
              onPlay={() => null}                     // defaults -> noop
              onPause={() => null}                    // defaults -> noop
              onEnd={() => null}                      // defaults -> noop
              onError={() => null}                    // defaults -> noop
              onStateChange={() => null}              // defaults -> noop
              onPlaybackRateChange={() => null}       // defaults -> noop
              onPlaybackQualityChange={() => null}    // defaults -> noop
            />
          </Block>}
          {!!((entry.stories && entry.stories.length) || (entry.media && entry.media.length) || (entry.alumni && entry.alumni.length) || (entry.locations && entry.locations.length)) && <Fragment>
            <hr />
            <Block>Linked Entries</Block>
            <Gallery>
              {!!(entry.stories && entry.stories.length) && entry.stories.map((story) => <Card isInDialog entry={story} onClick={openNewEntry(story.sys ? story.sys.id : story.meta.id, closeEntry, setInitial)} />)}
              {!!(entry.media && entry.media.length) && entry.media.map((media) => <Card isInDialog entry={media} onClick={openNewEntry(media.sys ? media.sys.id : media.meta.id, closeEntry, setInitial)} />)}
              {!!(entry.alumni && entry.alumni.length) && entry.alumni.map((alumnus) => <Card isInDialog entry={alumnus} onClick={openNewEntry(alumnus.sys ? alumnus.sys.id : alumnus.meta.id, closeEntry, setInitial)} />)}
              {!!(entry.locations && entry.locations.length) && entry.locations.map((location) => <Card isInDialog entry={location} onClick={openNewEntry(location.sys ? location.sys.id : location.meta.id, closeEntry, setInitial)} />)}
            </Gallery>
          </Fragment>}
        </Block>
      </Col>
    </Component>
  );
};