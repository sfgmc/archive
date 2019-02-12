import React from 'react';
import { Block } from 'jsxstyle';
export const Spacer = (props) => (
  <Block
    width={props.size || 8}
    height={props.size || 8}
    minWidth={props.size || 8}
    minHeight={props.size || 8}
  />
)