/* @jsx jsx */
import { useQuery } from 'react-apollo-hooks';
import { capitalize } from '../../utils';
import { GET_INTROSPECTION, GET_RECORD_LIST_QUERY } from './queries';

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
