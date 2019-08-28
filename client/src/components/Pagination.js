import { IconButton, TextInputField } from 'evergreen-ui';
import { InlineRow, Row } from 'jsxstyle';
import React from 'react';
import { Spacer } from './Spacer';
export function Pagination({ page, setPage, limit, setLimit }) {
  return (
    <Row justifyContent="center">
      <InlineRow alignItems="center" marginTop={-20}>
        <IconButton
          icon="caret-left"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        />
        <Spacer />
        <TextInputField
          width={40}
          textAlign="center"
          align="center"
          hint="Page"
          value={page}
          marginBottom={0}
          marginTop={20}
          onChange={e => setPage(Number(e.target.value))}
        />
        <Spacer />
        <IconButton icon="caret-right" onClick={() => setPage(page + 1)} />
      </InlineRow>
      <Spacer />
      <InlineRow>
        <TextInputField
          width={80}
          textAlign="center"
          align="center"
          hint="Entries per page"
          value={limit}
          marginBottom={0}
          marginTop={20}
          onChange={e => setLimit(Number(e.target.value))}
        />
      </InlineRow>
    </Row>
  );
}
