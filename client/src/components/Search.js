/* @jsx jsx */
import { css, jsx } from '@emotion/core';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import { IconButton, SearchInput, TextInputField } from 'evergreen-ui';
import { Block, Col, InlineRow, Row } from 'jsxstyle';
import React from 'react';
import 'react-calendar/dist/Calendar.css';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import {
  useGetContentTypes,
  useGetEntriesByFilters
} from '../services/api/hooks';
import { DisplayCard } from './DisplayCard';
import { FilterFields } from './FilterFields';
import { Spacer } from './Spacer';

export const Search = props => {
  // const archive = useArchiveStore();
  // console.log({ entriesToShow: archive.store.entriesToShow });

  const [filters, setFilters] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  const { contentTypes, error, loading } = useGetContentTypes();

  const [limit, setLimit] = React.useState(50);
  const [page, setPage] = React.useState(1);

  const {
    data: entriesData,
    error: entriesError,
    loading: entriesLoading
  } = useGetEntriesByFilters({
    filters,
    searchTerm,
    contentTypes,
    error,
    loading,
    limit,
    skip: limit * (page - 1)
  });

  console.log(entriesData, entriesError, entriesLoading);
  return (
    <div className="box alt container" id="searchBox">
      <Block
        component="h3"
        background="#ffffff"
        boxShadow="0 0 80px 0 rgba(255,255,255,1)"
      >
        Search the archive:
      </Block>
      <Row width="100%" alignItems="center" justifyContent="center">
        <Col
          background="#ffffff"
          boxShadow="0 0 80px 0 rgba(255,255,255,1)"
          smWidth="100%"
          width="100%"
          lgWidth="50%"
        >
          <SearchInput
            placeholder="Search terms..."
            width="100%"
            value={searchTerm}
            onChange={e => {
              const searchTerm = e.target.value;
              setSearchTerm(searchTerm);
            }}
          />
          <Spacer />
          <FilterFields
            filters={filters}
            filterLists={{ contentTypes, tags: [] }}
            onFilterAdd={filterList => {
              console.log(filterList);
              setFilters(filterList);
            }}
            onFilterRemove={filterList => {
              console.log(filterList);
              setFilters(filterList);
            }}
          />
        </Col>
      </Row>
      <Spacer />
      <Row justifyContent="center">
        <InlineRow alignItems="center" marginTop={-20}>
          <IconButton
            icon="caret-left"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          />
          <Spacer />
          <TextInputField
            width={40}
            textAlign="center"
            align="center"
            hint="Page"
            value={page}
            marginBottom={0}
            marginTop={20}
            onChange={e => setPage(Number(e.target.value))}
          />
          <Spacer />
          <IconButton icon="caret-right" onClick={() => setPage(page + 1)} />
        </InlineRow>
        <Spacer />
        <InlineRow>
          <TextInputField
            width={80}
            textAlign="center"
            align="center"
            hint="Entries per page"
            value={limit}
            marginBottom={0}
            marginTop={20}
            onChange={e => setLimit(Number(e.target.value))}
          />
        </InlineRow>
      </Row>
      <Spacer />
      <hr />
      {entriesLoading && <div>Loading...</div>}
      {entriesError && <div>An Error Occurred loading entries.</div>}
      {entriesData.length && (
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry>
            {entriesData.map((entry, index) => (
              <DisplayCard entry={entry} onClick={e => null} />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </div>
  );
};

const galleryCss = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
