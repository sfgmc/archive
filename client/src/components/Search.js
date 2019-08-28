/* @jsx jsx */
import { css, jsx } from '@emotion/core';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import { SearchInput } from 'evergreen-ui';
import { Block, Col, Row } from 'jsxstyle';
import React from 'react';
import 'react-calendar/dist/Calendar.css';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { withRouter } from 'react-router';
import {
  useGetContentTypes,
  useGetEntriesByFilters
} from '../services/api/hooks';
import { DisplayCard } from './DisplayCard';
import { FilterFields } from './FilterFields';
import { Pagination } from './Pagination';
import { Spacer } from './Spacer';

export const Search = withRouter(props => {
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
      <Pagination
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
      <Spacer />
      <hr />
      {entriesLoading && <div>Loading...</div>}
      {entriesError && <div>An Error Occurred loading entries.</div>}
      {Boolean(entriesData.length) && (
        <React.Fragment>
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
          >
            <Masonry>
              {entriesData.map((entry, index) => (
                <DisplayCard
                  entry={entry}
                  onClick={e =>
                    props.history.push(`/${entry.contentType}/${entry.sys.id}`)
                  }
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
          <Spacer />
          <Pagination
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
          <Spacer />
        </React.Fragment>
      )}
    </div>
  );
});

const galleryCss = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
