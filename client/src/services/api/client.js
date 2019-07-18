import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import config from '../../config';

export const GRAPHQL_URL = `${config.backEndServer}/graphql`;

export const cache = new InMemoryCache();

export const client = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_URL }),
  cache
});
