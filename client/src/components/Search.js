import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
// import { Gallery } from './Gallery';
// import { filter, reject } from 'lodash';
import { SearchInput } from 'evergreen-ui';
import gql from 'graphql-tag';
import { Block, Col, Row } from 'jsxstyle';
import React from 'react';
import 'react-calendar/dist/Calendar.css';
import { useGetContentTypes } from '../services/api/hooks';
import { FilterFields } from './FilterFields';
// import { Card } from './Card';
import { Spacer } from './Spacer';

// import { mediaQueries } from '../lib/utils';

// import { useArchiveStore } from '../lib/ArchiveStore';

const mediaQueries = null;
const archive = null;

const buildQuery = (filters = [], searchTerm = '') => {
  let query = '';
  for (const filter of filters) {
  }
  if (searchTerm.length) {
  }
  return gql`
    ${query}
  `;
};

export const Search = props => {
  // const archive = useArchiveStore();
  // console.log({ entriesToShow: archive.store.entriesToShow });

  const [filters, setFilters] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  const { contentTypes } = useGetContentTypes();

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
      <Block height={30} />
      <hr />
      <div id="searchResults">
        {/* <SideSheet
          width="90vw"
          isShown={!!archive.store.activeEntry}
          onCloseComplete={() => {
            archive.methods.setActiveEntry(false);
          }}
          hasFooter={false}
        >
          <EntryBody entryId={archive.store.activeEntry} />
        </SideSheet> */}
        {/* <Gallery isLoading={archive.store.isLoading}>
          {archive.store.entriesToShow.map((entryId, index) => (
            <Card entryId={entryId} onClick={e => archive.methods.setActiveEntry(entryId)} />
          ))}
        </Gallery> */}
      </div>
    </div>
  );
};
