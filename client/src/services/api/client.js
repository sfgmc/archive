import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import config from '../../config';

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});
export const GRAPHQL_URL = `${config.backEndServer}/graphql`;

const httpLink = createHttpLink({
  uri: GRAPHQL_URL
});
export const cache = new InMemoryCache();

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache
});
