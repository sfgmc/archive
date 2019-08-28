import { Block } from 'jsxstyle';
import { isNumber } from 'lodash';
import React from 'react';

const sizes = {
  xxs: 4,
  xs: 8,
  s: 10,
  m: 14,
  l: 20,
  xl: 32,
  xxl: 45
};

export const Spacer = ({
  size = 'm',
  with: withProp = 'both', // tslint doesn't like the use of 'with', since it's an obscure js block operation
  flex
}) => {
  if (flex) {
    return <Block flex={1} />;
  }
  if (!sizes[size] && isNumber(size)) {
    console.warn(
      `You seem to be using a non-standard size in Spacer. If ${size} is needed long-term, please create a new option for it.`
    );
  }
  const propAdditions = {};
  if (withProp === 'height' || withProp === 'both') {
    propAdditions.height = sizes[size] || size;
    propAdditions.minHeight = sizes[size] || size;
    propAdditions.maxHeight = sizes[size] || size;
    if (withProp !== 'both') {
      propAdditions.width = 1;
      propAdditions.minWidth = 1;
      propAdditions.maxWidth = 1;
    }
  }
  if (withProp === 'width' || withProp === 'both') {
    propAdditions.width = sizes[size] || size;
    propAdditions.minWidth = sizes[size] || size;
    propAdditions.maxWidth = sizes[size] || size;
    if (withProp !== 'both') {
      propAdditions.height = 1;
      propAdditions.minHeight = 1;
      propAdditions.maxHeight = 1;
    }
  }
  return <Block {...propAdditions} transition={`all .3s ease-in-out`} />;
};

Spacer.displayName = 'Spacer';
