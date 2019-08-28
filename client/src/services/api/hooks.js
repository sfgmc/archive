/* @jsx jsx */
import { useQuery } from 'react-apollo-hooks';
import { capitalize } from '../../utils';
import {
  GET_FILTERED_RECORDS_QUERY,
  GET_INTROSPECTION,
  GET_QUERY_BY_ID,
  GET_RECORD_LIST_QUERY
} from './queries';

export const ensureTokenAttachment = () => {};

export const useGetContentTypes = () => {
  const { data, error, loading } = useQuery(GET_INTROSPECTION());
  console.log(data);
  let contentTypes = [];
  if (data && data.__schema) {
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
  console.log(query);
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
  const {
    contentTypes,
    error: ctError,
    loading: ctLoading
  } = useGetContentTypes();

  const query = GET_QUERY_BY_ID({ entryId, contentTypes, contentType });
  const {
    data: queryData,
    error: queryError,
    loading: queryLoading
  } = useQuery(query);
  if (ctError || ctLoading || queryError || queryLoading) {
    return {
      data: null,
      error: ctError || queryError,
      loading: ctLoading || queryLoading
    };
  }
  let data = queryData[contentType];
  data.contentType = contentType;
  return {
    data
  };
};

// // https://github.com/codemeasandwich/graphql-query-builder

// export const getEntries = ({ contentType, skip, limit, filters }) => {
//   const filter = {};
//   let entry = new Query(`${contentType}Collection`, filter);
//   entry.find(contentType.fields.map(f => f.name));
//   console.log(entry);
//   const { data, error, loading } = useQuery(entry);
//   return { data, error, loading };
// };
