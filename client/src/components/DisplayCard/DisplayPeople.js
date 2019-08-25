import { Row } from 'jsxstyle';
import React, { Fragment } from 'react';
import { Badge } from '../Badge';
import { Spacer } from '../Spacer';
export const DisplayPeople = ({ entry }) => {
  return (
    <Row flex={1} justifyContent="flex-end">
      {entry.isFifthSection && (
        <Fragment>
          <Badge color="red">Fifth Section</Badge>
          <Spacer />
        </Fragment>
      )}
      {entry.status === 'current' && <Badge color="blue">Active Member</Badge>}
      {entry.status !== 'current' && <Badge color="neutral">Alumni</Badge>}
    </Row>
  );
};
