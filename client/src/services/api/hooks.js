/* @jsx jsx */
import { get } from 'lodash';
import { useState } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { capitalize } from '../../utils';
import { setWindowValue } from '../windowStore';
import {
  GET_ENTRY_BY_ID,
  GET_FILTERED_RECORDS_QUERY,
  GET_INTROSPECTION,
  GET_LINKED_ENTRIES_BY_ENTRY,
  GET_RECORD_LIST_QUERY
} from './queries';

export const ensureTokenAttachment = () => {};

export const useGetContentTypes = () => {
  const { data, error, loading } = useQuery(GET_INTROSPECTION());

  let contentTypes = [];
  if (data && data.__schema) {
    setWindowValue('schema', data.__schema);
    const queryName = data.__schema.queryType.name;
    const queryObject = data.__schema.types.find(t => t.name === queryName);
    contentTypes = queryObject.fields
      .filter(f => !f.name.includes('Collection'))
      .map(f => f.name)
      .map(name => {
        const thisType = data.__schema.types.find(
          t => t.name === capitalize(name)
        );
        let fields = [];
        if (thisType) {
          fields = thisType.fields;
        }
        return {
          name,
          fields
        };
      });
    setWindowValue('contentTypes', contentTypes);
  }
  return { contentTypes, error, loading };
};

export const useGetEntriesByContentType = (
  contentType,
  fields,
  skip,
  limit
) => {
  const { data, error, loading } = useQuery(
    GET_RECORD_LIST_QUERY(
      contentType.name,
      fields || contentType.fields.map(f => f.name),
      skip,
      limit
    )
  );
  const list = data[`${contentType.name}Collection`]
    ? data[`${contentType.name}Collection`].items
    : [];
  return {
    list,
    error,
    loading
  };
};

export const useGetEntriesByFilters = ({
  contentTypes,
  tags,
  filters,
  searchTerm,
  loading,
  error,
  skip,
  limit
}) => {
  const query = GET_FILTERED_RECORDS_QUERY(
    filters,
    searchTerm,
    contentTypes,
    tags,
    skip,
    limit
  );

  const {
    data: queryData,
    error: queryError,
    loading: queryLoading
  } = useQuery(query);
  let data = queryData;

  // concat data
  if (!queryError && !queryLoading) {
    data = [];
    for (const key of Object.keys(queryData)) {
      if (!queryData[key].items) continue;
      const collection = queryData[key].items.map(i => ({
        ...i,
        contentType: key.split('Collection')[0]
      }));
      data = data.concat(collection);
    }

    // run sort
    data = data.sort((a, b) => (a.sys.id > b.sys.id ? 1 : -1));
  }

  return {
    data,
    error: error || queryError,
    loading: loading || queryLoading
  };
};

export const useGetEntryById = ({ entryId, contentType }) => {
  const query = GET_ENTRY_BY_ID({ entryId, contentType });
  const {
    data: queryData,
    error: queryError,
    loading: queryLoading
  } = useQuery(query);
  if (queryError || queryLoading) {
    return {
      data: null,
      error: queryError,
      loading: queryLoading
    };
  }

  let data = queryData[contentType];
  data.contentType = contentType;
  return {
    data
  };
};

export const useGetCollectionsByEntry = ({ entry }) => {
  console.log('useGetCollectionsByEntry', { entry });
  const [collections, setCollections] = useState([]);
  const allCollections = [];
  const allCollectionsObjects = get(entry, 'collectionsCollection.items') || [];

  for (const thisCollection of allCollectionsObjects) {
    const collectionId = thisCollection.sys.id;
    // TODO: Loop through collections, make a SINGLE query call to get info on ALL of them.
  }
  const collectionId = get(entry, 'collectionsCollection.items.0.sys.id');

  //"CollectionLinkingCollections"
  let data = [];
  let error = null;
  let loading = null;
  console.log({ collectionId });
  if (!collectionId) {
    // make sure there are two queries so react doesn't flip out about conditional hooks
    const defaultQuery = useQuery(GET_INTROSPECTION());
    const defaultQuery2 = useQuery(GET_INTROSPECTION());
    data = [];
    error = null;
    loading = null;
  } else {
    const results = useGetLinkedEntriesByEntry({
      entry: {
        contentType: 'collection',
        sys: { id: collectionId }
      }
    });
    data = results.data || [];
    error = results.error;
    loading = results.loading;
  }

  return { data, error, loading };
};

export const useGetLinkedEntriesByEntry = ({ entry }) => {
  console.log('useGetLinkedEntriesByEntry', { entry });
  const schema = window.__schema;

  const query = GET_LINKED_ENTRIES_BY_ENTRY({ entry });
  console.log(query);
  const { data, error, loading } = useQuery(query);
  console.log('useGetLinkedEntriesByEntry', { data, error, loading });
  let collections = [];
  if (data && data.collection) {
    console.log('useGetLinkedEntriesByEntry if', data.collection.linkedFrom);
    for (const key of Object.keys(data.collection.linkedFrom)) {
      if (key === '__typename') continue;
      const linkedFromCollection = data.collection.linkedFrom[key];
      console.log('useGetLinkedEntriesByEntry if for ', {
        linkedFromCollection
      });
      const contentType = key.split('Collections')[0];
      collections = collections.concat(
        linkedFromCollection.items.map(i => ({
          ...i,
          contentType: contentType
        }))
      );
    }
  }
  return {
    data: collections,
    loading,
    error
  };
};

// // https://github.com/codemeasandwich/graphql-query-builder

// export const getEntries = ({ contentType, skip, limit, filters }) => {
//   const filter = {};
//   let entry = new Query(`${contentType}Collection`, filter);
//   entry.find(contentType.fields.map(f => f.name));
//
//   const { data, error, loading } = useQuery(entry);
//   return { data, error, loading };
// };
