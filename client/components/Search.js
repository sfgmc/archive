import React from 'react';
import { Fragment } from 'react';

import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css'
import 'react-calendar/dist/Calendar.css'
import { Block, Col, Row } from 'jsxstyle';
import { Gallery } from './Gallery';
import { Spacer } from './Spacer';
import { filter, reject } from 'lodash';
import { SearchInput, Switch, SelectMenu, Button } from 'evergreen-ui';
import * as moment from 'moment';
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry.nostyle'

import { Entry } from '../components/Entry';
import {
  retrieveSearchResults,
} from '../lib/searchState';

import {
  mediaQueries,
} from '../lib/utils';

export const Search = (props) => {
  const { state, dispatch } = props;
  const {
    setShouldFilterByDate, setFilterByDateRange, setFilterByTags,
    setFilterByContentTypes, setInitialEntry, setShouldShowUnprocessed,
    setSearchTerm,
  } = dispatch;
  return (
    <div className="box alt container" id="searchBox">
      <Block component="h3" background="#ffffff" boxShadow="0 0 80px 0 rgba(255,255,255,1)">Search the archive:</Block>
      <Row width="100%" alignItems="center" justifyContent="center">
        <Block
          background="#ffffff"
          boxShadow="0 0 80px 0 rgba(255,255,255,1)"
          mediaQueries={mediaQueries}
          smWidth="100%"
          width="100%"
          lgWidth="50%"
        >
          <SearchInput
            placeholder="Search terms..."
            width="100%"
            value={state.searchTerm}
            onChange={e => {
              const searchTerm = e.target.value;
              setSearchTerm(searchTerm)
              retrieveSearchResults({ state: { ...state, searchTerm }, setState: dispatch })
            }}
          />
        </Block>
      </Row>
      <Block height={30} />
      <Row alignItems="center" justifyContent="center" background="#ffffff" boxShadow="0 0 80px 0 rgba(255,255,255,1)">
        <Row alignItems="center" justifyContent="flex-end" flex={1}>
          <Row justifyContent="flex-end" textAlign="right">Search for: </Row>
          <Block width={15} />
          <Block>
            <SelectMenu
              isMultiSelect
              title="Select Content Types"
              options={
                reject(
                  state.contentTypes,
                  (type) => type.id === 'tags'
                ).map(
                  (type) => ({ value: type.id, label: type.label })
                )
              }
              selected={
                reject(
                  state.filterByContentTypes,
                  (type) => !filter(state.contentTypes, { id: type })[0]
                ).map(
                  (type) => {
                    const contentType = filter(state.contentTypes, { id: type })[0] || {}
                    return contentType.id
                  }
                )
              }
              onSelect={(result) => {
                const results = [
                  ...state.filterByContentTypes,
                  result.value,
                ];
                setFilterByContentTypes(results);
                retrieveSearchResults({
                  state: { ...state, filterByContentTypes: results },
                  setState: dispatch
                })
              }}
              onDeselect={(result) => {
                const results = reject(state.filterByContentTypes, (item) => item === result.value)
                setFilterByContentTypes(results);
                retrieveSearchResults({
                  state: { ...state, filterByContentTypes: results },
                  setState: dispatch
                })
              }}
            >
              <Button>{state.filterByContentTypes.map((type, index) => {
                const contentType = filter(state.contentTypes, { id: type })[0] || {}
                if (index !== 0 && index === (state.filterByContentTypes.length - 1)) {
                  return `and ${contentType.label}`
                }
                if (state.filterByContentTypes.length > 2 && index <= (state.filterByContentTypes.length - 2)) {
                  return `${contentType.label},`
                }
                return contentType.label
              }).join(' ') || 'Everything'}</Button>
            </SelectMenu>
          </Block>
          <Block width={15} />
        </Row>
        <Row alignItems="center" flex={1}>
          <Row justifyContent="flex-end" textAlign="right">Filter by: </Row>
          <Block width={15} />
          <Block>
            <SelectMenu
              isMultiSelect
              title="Select Tags"
              options={state.tags.map(
                (tag) => {
                  return {
                    value: tag.tag,
                    label: tag.label
                  }
                }
              )}
              selected={state.filterByTags}
              onSelect={(result) => {
                const results = [
                  ...state.filterByTags,
                  result.value,
                ];
                setFilterByTags(results)
                retrieveSearchResults({ state: { ...state, filterByTags: results }, setState: dispatch })
              }}
              onDeselect={(result) => {
                const results = reject(state.filterByTags, (tag) => tag === result.value)
                setFilterByTags(results)
                retrieveSearchResults({ state: { ...state, filterByTags: results }, setState: dispatch })
              }}
            >
              <Button>{state.filterByTags.map((tag, index) => {
                const foundTag = filter(state.tags, { tag })[0] || {}
                if (index !== 0 && index === (state.filterByTags.length - 1)) {
                  return `and ${foundTag.label}`
                }
                if (state.filterByTags.length > 2 && index === (state.filterByTags.length - 2)) {
                  return `${foundTag.label},`
                }
                return foundTag.label
              }).join(' ') || 'Everything'}</Button>
            </SelectMenu>
          </Block>
        </Row>
      </Row>
      <Block height={30} />
      <Col alignItems="center" width="100%" background="#ffffff" boxShadow="0 0 80px 0 rgba(255,255,255,1)">
        <Row alignItems="center" flex={1} justifyContent="flex-end">
          <Block>Filter by date?</Block>
          <Spacer />
          <Switch margin={0} checked={state.shouldFilterByDate} onChange={(e) => {
            const shouldFilterByDate = e.target.checked;
            setShouldFilterByDate(shouldFilterByDate)
            retrieveSearchResults({ state: { ...state, shouldFilterByDate }, setState: dispatch })
          }} />
        </Row>
        <Spacer />
        <Block flex={2}>
          <DateRangePicker
            value={state.filterByDateRange}
            onChange={(results) => {
              setFilterByDateRange(results)
              retrieveSearchResults({ state: { ...state, filterByDateRange: results }, setState: dispatch })
            }}
            disabled={!state.shouldFilterByDate}
          />
        </Block>
        <Spacer />
        <Row alignItems="center" flex={1} justifyContent="flex-end">
          <Block>Include Unprocessed Entries?</Block>
          <Spacer />
          <Switch margin={0} checked={state.shouldShowUnprocessed} onChange={(e) => {
            const shouldShowUnprocessed = e.target.checked;
            setShouldShowUnprocessed(shouldShowUnprocessed)
            retrieveSearchResults({ state: { ...state, shouldShowUnprocessed }, setState: dispatch })
          }} />
        </Row>
      </Col>
      <Block height={30} />
      <hr />
      <div id="searchResults">
        <Block component="h1" background="#ffffff" boxShadow="0 0 80px 0 rgba(255,255,255,1)">
          Results
          {!!state.searchTerm.length && <Fragment> for {state.searchTerm}<br /></Fragment>}
          {!!state.filterByContentTypes.length && ` in ${state.filterByContentTypes.map((type, index) => (filter(state.contentTypes, { id: type })[0] || {}).label).join(' and ')}`}
          {!!state.filterByTags.length && <Fragment><br />filtered by {state.filterByTags.map((tag, index) => tag.label).join(' and ')}</Fragment>}
          {!!state.filterByDateRange && !!state.filterByDateRange.length && <Fragment><br />from {moment(state.filterByDateRange[0]).format('MMM DD YYYY')} to {moment(state.filterByDateRange[1]).format('MMM DD YYYY')}</Fragment>}
        </Block>
        <Gallery>
          {state.initialEntry && <Entry
            key="initialEntry"
            entry={state.initialEntry}
            open
            clearInitial={() => setInitialEntry(false)}
            setInitial={(entry) => setInitialEntry(entry)}
          />}
          {state.entries.map((entry, index) => (
            <Entry
              key={`entry-results-${index}`}
              entry={entry}
              clearInitial={() => new Promise((resolve, reject) => { setInitialEntry(false); resolve() })}
              setInitial={(entry) => setInitialEntry(entry)}
            />
          ))}
        </Gallery>
      </div>
    </div>
  )
}