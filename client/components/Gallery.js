import * as React from 'react';
import Masonry from 'react-masonry-component';

const masonryOptions = {
  transitionDuration: 0
};

const imagesLoadedOptions = { background: '.my-bg-image-el' };

export const Gallery = props => (
  <Masonry
    className={'my-gallery-class'} // default ''
    elementType={'ul'} // default 'div'
    options={masonryOptions} // default {}
    disableImagesLoaded={false} // default false
    updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
    imagesLoadedOptions={imagesLoadedOptions} // default {}
  >
    {props.children}
  </Masonry>
);

export default Gallery;
