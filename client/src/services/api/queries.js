/* @jsx jsx */
import { getIntrospectionQuery } from 'graphql';
import gql from 'graphql-tag';
import { jsonToGraphQLQuery as json2gql } from 'json-to-graphql-query';
import { getContentTypes, getSchema } from '../windowStore';

export const GET_INTROSPECTION = () => gql`
  ${getIntrospectionQuery()}
`;

const defaultQuery = { __schema: { types: { kind: true } } };

const defaultQueryGql = () => {
  const request = { query: defaultQuery };
  const stringRequest = json2gql(request, { pretty: true });
  return gql`
    ${stringRequest}
  `;
};

const fieldBlackList = ['linkedFrom'];
const contentTypeBlackList = [
  'asset',
  'fieldPermissions',
  'tags',
  'collection',
  'suggestedEdits',
  'events'
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

const dynamicReplacement = {
  linkedFrom: ({ currentContentType }) => {
    // return false;
    const collections = {};
    const contentTypes = getContentTypes();
    for (const contentType of contentTypes) {
      if (
        contentTypeBlackList.includes(contentType.name) ||
        contentType.name === currentContentType
      )
        continue;
      collections.entryCollection = {
        items: { sys: { id: true } }
      };
    }
    return collections;
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
  tags = [],
  skip = 0,
  limit = 50
) => {
  const contentTypes = getContentTypes();
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
        if (
          fieldBlackList.includes(field.name) ||
          !listAllFieldWhiteList.includes(field.name)
        ) {
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
    return defaultQueryGql();
  }
  const stringRequest = json2gql(request, { pretty: true });

  return gql`
    ${stringRequest}
  `;
};

export const GET_ENTRY_BY_ID = ({
  entryId,
  contentType,
  fields,
  queryOnly
}) => {
  const contentTypes = getContentTypes();

  const request = { query: { [contentType]: {} } };

  if (!queryOnly) {
    request.query[contentType].__args = {
      id: entryId
    };
  }

  const fullContentType = contentTypes.find(ct => ct.name === contentType);
  if (!fullContentType) {
    return defaultQueryGql();
  }
  const queryName = fullContentType.name.toLowerCase();
  for (const field of fullContentType.fields) {
    if (fields && !fields.includes(field.name)) continue;
    let fieldName = field.name;
    if (fieldName.includes('Collection')) {
      request.query[queryName][fieldName] = { items: { sys: { id: true } } };
      continue;
    }
    if (dynamicReplacement[fieldName]) {
      request.query[queryName][fieldName] = dynamicReplacement[fieldName]({
        currentContentType: contentType
      });
      continue;
    }
    request.query[queryName][fieldName] = replacement[fieldName] || true;
  }
  if (queryOnly) {
    return request.query[contentType];
  }
  const stringRequest = json2gql(request, { pretty: true });
  return gql`
    ${stringRequest}
  `;
};

export const GET_COLLECTION_ITEMS_BY_ID = ({ collectionId }) => {
  const contentTypes = getContentTypes();
  const request = { query: {} };
  request.query[contentType] = {
    __args: {
      id: collectionId
    }
  };

  const contentType = contentTypes.find(ct => ct.name === 'collection');

  if (!contentType) {
    return defaultQueryGql();
  }
  const queryName = contentType.name.toLowerCase();
  // for (const field of contentType.fields) {
  //
  //   let fieldName = field.name;
  //   if (fieldName.includes('Collection')) {
  //     request.query[queryName][fieldName] = { items: { sys: { id: true } } };
  //     continue;
  //   }
  //   if (dynamicReplacement[fieldName]) {
  //     request.query[queryName][fieldName] = dynamicReplacement[fieldName]({
  //       contentTypes,
  //       currentContentType: contentType
  //     });
  //     continue;
  //   }
  //   request.query[queryName][fieldName] = replacement[fieldName] || true;
  // }
  // const stringRequest = json2gql(request, { pretty: true });
  //
  // return gql`
  //   ${stringRequest}
  // `;
};

export const GET_LINKED_ENTRIES_BY_ENTRY = ({ entry }) => {
  console.log('GET_LINKED_ENTRIES_BY_ENTRY', { entry });
  if (!entry) {
    return defaultQueryGql();
  }

  const contentTypes = getContentTypes();
  const schema = getSchema();

  const thisContentTypeName = entry.contentType;
  const thisContentType = contentTypes.find(
    ct => ct.name === thisContentTypeName
  );
  console.log(thisContentType);
  const linkedFromField = thisContentType.fields.find(
    field => field.name === 'linkedFrom'
  );

  const linkedFromTypeName = linkedFromField.type.name;
  console.log({ linkedFromTypeName });
  const linkedFromType = schema.types.find(t => t.name === linkedFromTypeName);
  const linkedFields = linkedFromType.fields.map(f => f.name);
  console.log({ linkedFields, contentTypes });
  const linkedFrom = {};
  for (const field of linkedFields) {
    if (field === 'entryCollection') continue;
    const fieldContentType = contentTypes.find(
      ct => `${ct.name}Collection` === field
    );
    linkedFrom[field] = {
      items: GET_ENTRY_BY_ID({
        entryId: false,
        contentType: fieldContentType.name,
        queryOnly: true,
        fields: listAllFieldWhiteList
      })
    };
  }
  console.log({ linkedFrom });
  const request = { query: {} };
  request.query = {
    collection: {
      __args: {
        id: entry.sys.id
      },
      linkedFrom
    }
  };
  const stringRequest = json2gql(request, { pretty: true });
  return gql`
    ${stringRequest}
  `;
};
