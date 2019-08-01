/* @jsx jsx */
import { getIntrospectionQuery } from 'graphql';
import gql from 'graphql-tag';

export const GET_INTROSPECTION = () => gql`
  ${getIntrospectionQuery()}
`;

const fieldBlackList = ['linkedFrom'];

const buildListQuery = (contentType, fields, skip, limit, filter) => `
  ${contentType}Collection (skip: ${skip}, limit: ${limit}) {
    items {
      ${fields
        .filter(f => !fieldBlackList.includes(f) && !f.includes('Collection'))
        .map(f => {
          if (f === 'sys') {
            return `${f} {
              id
            }\n`;
          }
          if (f === 'file') {
            return `${f} {
              url
            }\n`;
          }
          if (f === 'story') {
            return `${f} {
              json
            }\n`;
          }
          if (f === 'headshot') {
            return `${f} {
              sys { id }
              file { url }
            }\n`;
          }
          return `${f}\n`;
        })}
    }
  }
`;
export const GET_RECORD_LIST_QUERY = (
  contentType,
  fields = [],
  skip = 0,
  limit = 25
) => gql`
  query {
    ${buildListQuery(contentType, fields, skip, limit)}
  }  
`;

// {
//   id: uid
//   type: 'contentTypes' | 'tags' | 'dateRange' | 'shouldIncludeAdmin'
//   value: contentType.id | tag.label | [date, date] | boolean
// }
// export const GET_FILTERED_RECORDS_QUERY = (
//   filters,
//   searchTerm,
//   contentTypes,
//   tags,
//   skip, limit
// ) => {
//   const contentTypeFilters = filters.filter(f => f.type === 'contentTypes');
//   const tagFilters = filters.filter(f => f.type === 'tags');
//   const dateRangeFilters = filter.filter(f => f.type === 'dateRange');
//   const shouldIncludeAdminFilters = filter.filter(
//     f => f.type === 'shouldIncludeAdmin'
//   );

//   return gql`
//   query {

//   }`;
// };
