import * as React from 'react';
import { ApolloProvider } from 'react-apollo-hooks';
import { client } from './client';

export const Provider = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
