/* @jsx jsx */
import { getIntrospectionQuery } from 'graphql';
import gql from 'graphql-tag';

export const GET_INTROSPECTION = () => gql`
  ${getIntrospectionQuery()}
`;

const fieldBlackList = ['linkedFrom'];
export const GET_RECORD_LIST_QUERY = (
  contentType,
  fields = [],
  skip = 0,
  limit = 25
) => gql`
  query {
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
  }
`;
