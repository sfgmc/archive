import React from "react";
import { Badge as UIBadge } from "evergreen-ui";

export const Badge = props => (
  <UIBadge
    fontSize={10}
    whiteSpace="nowrap"
    overflow="hidden"
    textOverflow="ellipsis"
    textTransform="capitalize"
    minWidth={50}
    {...props}
  />
);
