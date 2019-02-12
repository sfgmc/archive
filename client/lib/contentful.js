import * as contentful from 'contentful';

import { normalizeEntry } from './searchState';

const contentfulAPItoken = 'd7e61888dc1af306b0d1d3ba008365bec1dab28f8fe498993ff0feb92152f7cb'
const space_id = 'mj8q5gk08usa';
const environment_id = 'master';
export const client = contentful.createClient({
  space: space_id,
  accessToken: contentfulAPItoken
})

export const getEntry = async (entryId) => {
  const entryResponse = await client.getEntry(entryId, { include: 2 });
  return normalizeEntry(entryResponse)
}