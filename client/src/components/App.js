import React from 'react';
import { useGetContentTypes } from '../services/api/hooks';
export default ({ children }) => {
  const { loading, error } = useGetContentTypes(); // make sure contentTypes are loaded.
  // make sure tags are loaded.
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return <div>{children}</div>;
};
