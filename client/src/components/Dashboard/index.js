/* @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Table } from 'evergreen-ui';
import { isString } from 'lodash';
import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import logo from '../../images/logo-invert.svg';
import headerOverlay from '../../images/overlay.png';
import {
  useGetContentTypes,
  useGetEntriesByContentType
} from '../../services/api/hooks';
import { Spacer } from '../Spacer';

export const Dashboard = ({ onLogout }) => {
  const { contentTypes, error, loading } = useGetContentTypes();
  return (
    <div>
      {loading && <div>Loading</div>}
      {error && <div>Error {error.message}</div>}
      {Boolean(contentTypes.length) && (
        <div>
          <Sidebar
            onLogout={onLogout}
            sections={contentTypes.map(type => ({
              name: type.name,
              path: `/contribute/${type.name}`
            }))}
          />
          <Switch>
            {contentTypes.map(type => (
              <Route
                path={`/contribute/${type.name}`}
                component={() => <RecordList contentType={type} />}
              />
            ))}
            <Route path="/contribute/" component={() => <div>none</div>} />
          </Switch>
        </div>
      )}
    </div>
  );
};

const SidebarCss = css`
  width: 200px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-image: url(${headerOverlay});
  background-position: bottom center, top left, center center;
  color: white;
`;
const sidebarItemCss = css`
  height: 40px;
  padding: 16px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: white;
  font-weight: bold;
  font-size: 20px;
  text-transform: uppercase;
  text-decoration: none;

  & a {
    color: white;
    font-weight: bold;
    font-size: 20px;
    text-transform: uppercase;
    text-decoration: none;
  }
`;
const Sidebar = ({ sections, onLogout }) => {
  const [_, __] = React.useState(false);
  return (
    <div css={SidebarCss}>
      <Spacer />
      <div css={sidebarItemCss}>
        <img src={logo} width="100%" />
      </div>
      <Spacer />
      <div>
        <hr />
      </div>
      <div css={sidebarItemCss}>Account</div>
      <Spacer />
      <div css={sidebarItemCss} onClick={onLogout}>
        Logout
      </div>
      <Spacer />
      <div>
        <hr />
      </div>
      <Spacer />
      {sections.map(section => (
        <div css={sidebarItemCss} key={`${section.name}-sidebar`}>
          <Link to={section.path}> {section.name}</Link>
        </div>
      ))}
    </div>
  );
};

const recordListCss = css`
  width: calc(100% - 200px);
  height: 100%;

  position: fixed;
  left: 200px;
  top: 0;
  overflow-y: auto;
`;

const RecordList = ({ contentType }) => {
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

// TODO: dashboard list below:
// //x - look into sub-using the router in dashboard
//// x- build sidebar
//   x - loop over contentTypes
// build list view
////   x- pull from contentType
////   x- loop over first page
//   allow for record delete
//   allow for record creation
//   v2 allow for bulk update
//   click to go to >>
// build single view
//   pull record
//   allow for update of record
//   allow for local storage of record if creating
