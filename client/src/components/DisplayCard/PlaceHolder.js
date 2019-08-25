import React from 'react';
import ContentLoader from 'react-content-loader';
export const PlaceHolder = ({ width = 200, height = 200 }) => (
  <ContentLoader
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...{ width, height }}
  >
    <rect x="0" y="70" rx="5" ry="5" {...{ width, height }} />
  </ContentLoader>
);
