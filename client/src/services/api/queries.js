/* @jsx jsx */
import { getIntrospectionQuery } from 'graphql';
import gql from 'graphql-tag';
import { jsonToGraphQLQuery as json2gql } from 'json-to-graphql-query';

export const GET_INTROSPECTION = () => gql`
  ${getIntrospectionQuery()}
`;

const fieldBlackList = ['linkedFrom'];
const contentTypeBlackList = [
  'asset',
  'fieldPermissions',
  'tags',
  'collection',
  'suggestedEdits'
];
const listAllFieldWhiteList = [
  'name',
  'title',
  'file',
  'externalUrl',
  'sys',
  'headshot',
  'snaps',
  'type',
  'tags',
  'locationName',
  'geolocation',
  'isFifthSection',
  'status'
];
const replacement = {
  sys: {
    id: true
  },
  file: {
    url: true
  },
  headshot: {
    file: {
      url: true
    }
  },
  geolocation: {
    lat: true,
    lon: true
  },
  entryToEdit: {
    sys: {
      id: true
    }
  }
};

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
export const GET_FILTERED_RECORDS_QUERY = (
  filters = [],
  searchTerm = '',
  contentTypes = [],
  tags = [],
  skip = 0,
  limit = 50
) => {
  const contentTypeFilters = filters.filter(f => f.type === 'contentTypes');
  const tagFilters = filters.filter(f => f.type === 'tags');
  const dateRangeFilters = filters.filter(f => f.type === 'dateRange');

  const request = { query: {} };
  if (contentTypeFilters.length) {
    for (const ctFilter of contentTypeFilters) {
      const thisContentType = contentTypes.find(c => c.name === ctFilter.value);
      if (thisContentType) {
        const thisCollection = { items: {} };
        // add fields
        for (const field of thisContentType.fields) {
          if (fieldBlackList.includes(field.name)) continue;
          let fieldName = field.name;
          if (fieldName.includes('Collection')) {
            thisCollection.items[fieldName] = { items: { sys: { id: true } } };
            continue;
          }
          thisCollection.items[fieldName] = replacement[fieldName] || true;
        }
        // add filters

        // attach to query
        request.query[`${ctFilter.value}Collection`] = thisCollection;
      }
    }
  } else {
    for (const cType of contentTypes) {
      if (contentTypeBlackList.includes(cType.name)) continue;
      const thisCollection = { items: {} };
      for (const field of cType.fields) {
        console.log(field.name);
        if (
          fieldBlackList.includes(field.name) ||
          !listAllFieldWhiteList.includes(field.name)
        ) {
          console.log('app level filtered out');
          continue;
        }
        let fieldName = field.name;
        if (fieldName.includes('Collection')) {
          thisCollection.items[fieldName] = { items: { sys: { id: true } } };
          continue;
        }
        thisCollection.items[fieldName] = replacement[fieldName] || true;
      }
      // add filters
      thisCollection.__args = {
        limit: 10,
        skip
      };
      // attach to query
      if (!Object.keys(thisCollection.items).length) continue;
      request.query[`${cType.name}Collection`] = thisCollection;
    }
    const allCollections = Object.keys(request.query);
    for (const collection of allCollections) {
      request.query[collection].__args.limit = Math.round(
        limit / allCollections.length
      );
    }
    // default to all contentTypes
  }
  if (!Object.keys(request.query).length) {
    request.query = { __schema: { types: { kind: true } } };
  }
  const stringRequest = json2gql(request, { pretty: true });
  console.log(request, stringRequest);
  return gql`
    ${stringRequest}
  `;
};
