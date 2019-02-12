import React from 'react';
import { Block } from 'jsxstyle';

export const Pin = (props) => (
  <Block
    component="img"
    width={50}
    marginLeft={props.noTransform && -20}
    marginRight={props.noTransform && -20}
    transform={!props.noTransform && "translateX(-50%) translateY(-100%)"}
    props={{ src: '/static/images/location-pin.svg' }}
  />
)