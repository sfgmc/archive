import React from 'react';
import Masonry from 'react-masonry-component';

import { Block, Row } from 'jsxstyle';

import { Spinner } from 'evergreen-ui';

const masonryOptions = {
  transitionDuration: 0,
};

const imagesLoadedOptions = { background: '.my-bg-image-el' };

export const Gallery = props => {
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    setIsLoading(true);
  }, [props.children]);
  React.useEffect(() => {
    if (props.isLoading) {
      setIsLoading(true);
    }
  }, [props.isLoading]);
  return (
    <Block position="relative">
      <Row
        position="absolute"
        zIndex={2}
        left={0}
        top={-45}
        width="100%"
        height="100%"
        pointerEvents={isLoading ? undefined : 'none'}
        background={isLoading ? 'rgba(255,255,255,0.25)' : 'transparent'}
        backdropFilter={isLoading ? 'blur(10px)' : undefined}
        opacity={isLoading ? 1 : 0}
        transition="opacity .5s linear, background .5s linear, backdrop-filter .5s linear"
        justifyContent="center"
        marginTop={45}
      >
        <Spinner />
      </Row>
      <Masonry
        className={'my-gallery-class'} // default ''
        elementType={'ul'} // default 'div'
        options={masonryOptions} // default {}
        imagesLoadedOptions={imagesLoadedOptions} // default {}
        onImagesLoaded={() => {
          console.log('image loaded');
          if (!props.isLoading) {
            setIsLoading(false);
          }
        }}
      >
        {props.children}
      </Masonry>
    </Block>
  );
};
export default Gallery;
