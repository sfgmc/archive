import { useState, useEffect } from 'react';

import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css'
import 'react-calendar/dist/Calendar.css'
import { Block, Col } from 'jsxstyle';
import App from '../components/App'
import * as queryString from 'query-string';

import Component from '@reach/component-component';
import { Link, animateScroll as scroll } from "react-scroll";

import { Search } from '../components/Search';
import { Featured } from '../components/Featured';
import { Footer } from '../components/Footer';
import {
  retrieveSearchResults,
} from '../lib/searchState';

import { getEntry } from '../lib/contentful';

const parseUrlParams = (state, dispatch) => async () => {
  if (state.pageLoadHasRun) { return; }
  dispatch.setPageLoadHasRun(true)

  const urlParams = window.location.search;
  const parsedUrlParams = queryString.parse(urlParams);
  const newState = {};
  const {
    setFilterByContentTypes,
    setFilterByTags,
    setShouldFilterByDate,
    setFilterByDateRange,
    setSearchTerm,
    setInitialEntry,
  } = dispatch;
  let hasSearchParams = false;
  if (parsedUrlParams.types && parsedUrlParams.types.length) {
    newState.filterByContentTypes = parsedUrlParams.types.split(',')
    setFilterByContentTypes(newState.filterByContentTypes)
    hasSearchParams = true;
  }
  if (parsedUrlParams.tags && parsedUrlParams.tags.length) {
    newState.filterByTags = parsedUrlParams.tags.split(',')
    setFilterByTags(newState.filterByTags)
    hasSearchParams = true;
  }
  if (parsedUrlParams.dates && parsedUrlParams.dates.length) {
    newState.shouldFilterByDate = true;
    newState.filterByDateRange = parsedUrlParams.dates.split(',');
    setShouldFilterByDate(newState.shouldFilterByDate)
    setFilterByDateRange(newState.filterByDateRange)
    hasSearchParams = true;
  }
  if (parsedUrlParams.query && parsedUrlParams.query.length) {
    newState.searchTerm = parsedUrlParams.query
    setSearchTerm(newState.searchTerm)
    hasSearchParams = true;
  }
  if (hasSearchParams) {
    console.log({ hasSearchParams })
    scroll.scrollTo('searchBox', {
      duration: 1000,
      smooth: true,
      containerId: 'searchBox',
    })
  }

  // load initialEntry
  if (parsedUrlParams.entry) {
    newState.initialEntry = await getEntry(parsedUrlParams.entry);
    setInitialEntry(newState.initialEntry)
  }
  await retrieveSearchResults({ setState: dispatch, state: { ...state, ...newState } })
}


export const Home = (props) => {

  // set up state
  const [entries, setEntries] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [shouldIncludeAdmin, setShouldIncludeAdmin] = useState(false);
  const [shouldFilterByDate, setShouldFilterByDate] = useState(false);
  const [filterByDateRange, setFilterByDateRange] = useState(null);
  const [filterByTags, setFilterByTags] = useState([]);
  const [filterByContentTypes, setFilterByContentTypes] = useState(['stories', 'media']);
  const [initialEntry, setInitialEntry] = useState(null);
  const [pageLoadHasRun, setPageLoadHasRun] = useState(false);
  const [shouldShowUnprocessed, setShouldShowUnprocessed] = useState(false);

  const state = {
    entries, contentTypes, tags, searchTerm, shouldIncludeAdmin,
    shouldFilterByDate, filterByDateRange, filterByTags, filterByContentTypes,
    initialEntry, pageLoadHasRun, shouldShowUnprocessed
  }
  const dispatch = {
    setEntries, setContentTypes, setTags, setSearchTerm, setShouldIncludeAdmin,
    setShouldFilterByDate, setFilterByDateRange, setFilterByTags,
    setFilterByContentTypes, setInitialEntry, setPageLoadHasRun,
    setShouldShowUnprocessed,
  }
  const updateResults = (partialState) => {
    return retrieveSearchResults({ setState: dispatch, state: { ...state, ...partialState } })
  }

  // set up effects
  useEffect(() => { parseUrlParams(state, dispatch)() });

  // make sure we know the page has laoded
  return (
    <Component refs={{ searchRef: null }}>{(refs) => (
      <App>
        <div>
          <Col alignItems="center" justifyContent="center" className="header">
            <Block
              backgroundImage="url(/static/images/logo-invert.svg)"
              backgroundPosition="center center"
              backgroundRepeat="no-repeat"
              backgroundSize="contain"
              width="100%"
              maxWidth={500}
              height={200}
            />
            <h1>We remember.</h1>
            <Block component="p" width="100%" maxWidth={750}>
              An online portal for the history of the <br />
              San Francisco Gay Men's Chorus, <br />
              with the photos, videos, and stories that make us who we are.
                </Block>
          </Col>
          <div id="main">
            <header className="major container medium">
              <h2>
                I just want to get people together
                    <br />
                to have fun making music.
                    <br />
              </h2>
              <p>
                Jon Reed Sims
                    <br />
                SFGMC Founder
                  </p>
            </header>
            <Featured
              setShouldFilterByDate={setShouldFilterByDate}
              setFilterByDateRange={setFilterByDateRange}
              updateResults={updateResults}
            />
            <Search state={state} dispatch={dispatch} refs={refs} />
            <footer className="major container medium">
              <h3>We need your help</h3>
              <p>
                The SFGMC Archive is an ongoing volunteer effort to chronicle the history and stories of our community. As such,
                our work is never done, with new media and content being delivered to us regularly, and we need all the help
                we can get! If you're willing to contribute to the archive, either with tagging and uploading or by sharing
                your memories, please reach out.
            </p>
              <ul className="actions special">
                <li>
                  <a href="#" className="button">
                    Contribute to the Archive
                </a>
                </li>
              </ul>
            </footer>
          </div>

          <Footer />
        </div>
      </App>
    )}</Component>
  )
}

export default Home;