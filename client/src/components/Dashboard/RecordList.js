/* @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Table } from 'evergreen-ui';
import { isString } from 'lodash';
import React from 'react';
import { useGetEntriesByContentType } from '../../services/api/hooks';

export const recordListCss = css`
  width: calc(100% - 200px);
  height: 100%;

  position: fixed;
  left: 200px;
  top: 0;
  overflow-y: auto;
`;
export const RecordList = ({ contentType }) => {
  const _ = React.useState();
  const { list, error, loading } = useGetEntriesByContentType(contentType);
  const nonNameFields = contentType.fields.filter(
    f => f.name !== 'name' && f.name !== 'title' && f.name !== 'sys'
  );
  return (
    <div css={recordListCss}>
      {loading && <div>Loading</div>}
      {list && (
        <div style={{ padding: 16, overflowX: 'auto' }}>
          <Table width={nonNameFields.length * 154} height="calc(100vh - 48px)">
            <Table.Head>
              <Table.SearchHeaderCell />
              {nonNameFields.map(f => (
                <Table.TextHeaderCell key={`header-${f.name}`}>
                  {f.name}
                </Table.TextHeaderCell>
              ))}
            </Table.Head>
            <Table.VirtualBody height="calc(100% - 32px)">
              {list.map(item => (
                <Table.Row
                  key={item.sys.id}
                  isSelectable
                  onSelect={() => alert(item.name)}
                >
                  <Table.TextCell flexShrink={0} minWidth={154}>
                    {item.title || item.name}
                  </Table.TextCell>
                  {nonNameFields.map(f => (
                    <Table.TextCell key={`${item.sys.id}-${f.name}`}>
                      {isString(item[f.name])
                        ? item[f.name]
                        : JSON.stringify(item[f.name])}
                    </Table.TextCell>
                  ))}
                </Table.Row>
              ))}
            </Table.VirtualBody>
          </Table>
        </div>
      )}
    </div>
  );
};
