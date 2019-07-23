/* @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
  Avatar,
  Button,
  Icon,
  Menu,
  Pane,
  Paragraph,
  Position,
  SideSheet,
  Tab,
  Tablist
} from 'evergreen-ui';
import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.svg';
import * as headerOverlay from '../../images/overlay.png';
import { useAuth0 } from '../../services/auth';
import { menuCss } from '../Menu';
import { Spacer } from '../Spacer';

export const SidebarCss = css`
  width: 200px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-image: url(${headerOverlay});
  background-position: bottom center, top left, center center;
  color: white;
`;
export const sidebarItemCss = css`
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

const sidebarTabs = ['Contribute', 'Account'];
export const Sidebar = withRouter(({ history, sections, onLogout }) => {
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [tab, setTab] = React.useState(sidebarTabs[0]);
  const {
    loading,
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
    loginWithPopup
  } = useAuth0();
  return (
    <React.Fragment>
      <SideSheet
        width={300}
        position={Position.LEFT}
        isShown={showSidebar}
        onCloseComplete={() => setShowSidebar(false)}
        containerProps={{
          display: 'flex',
          flex: '1',
          flexDirection: 'column'
        }}
      >
        <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
          <Pane padding={16} borderBottom="muted">
            <img
              src={logo}
              width="100%"
              style={{ cursor: 'pointer' }}
              onClick={() => history.push('/')}
            />
            <Paragraph size={400} color="muted">
              Contributor Portal
            </Paragraph>
          </Pane>
          <Pane display="flex" padding={8}>
            <Tablist>
              {sidebarTabs.map((thisTab, index) => (
                <Tab
                  key={thisTab}
                  isSelected={thisTab === tab}
                  onSelect={() => setTab(thisTab)}
                >
                  {thisTab}
                </Tab>
              ))}
            </Tablist>
          </Pane>
        </Pane>
        {tab === 'Account' && (
          <Pane flex="1" overflowY="scroll" background="tint1" padding={16}>
            {isAuthenticated && (
              <Menu>
                <Menu.Group title={`Logged in as ${user.name}`}>
                  <Menu.Item icon="settings">Settings</Menu.Item>
                  <Menu.Item icon="person">Profile</Menu.Item>
                </Menu.Group>
                <Menu.Divider />
                <Menu.Group>
                  <Menu.Item icon="key-enter" onSelect={() => logout()}>
                    Logout
                  </Menu.Item>
                </Menu.Group>
              </Menu>
            )}
          </Pane>
        )}
        {tab === 'Contribute' && (
          <Pane flex="1" overflowY="scroll" background="tint1" padding={16}>
            <Menu>
              <Menu.Group>
                {sections.map(section => (
                  <Menu.Item
                    onSelect={() => {
                      history.push(section.path);
                      setShowSidebar(false);
                      setTab(sidebarTabs[0]);
                    }}
                  >
                    {section.name}
                  </Menu.Item>
                ))}
              </Menu.Group>
            </Menu>
          </Pane>
        )}
      </SideSheet>
      <div css={menuCss}>
        <Button onClick={() => setShowSidebar(true)}>
          <Icon icon="menu" />
        </Button>
      </div>
    </React.Fragment>
  );

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
      <div css={sidebarItemCss}>
        {!!user && (
          <React.Fragment>
            <Avatar src={user.picture} isSolid name={user.name} />
            {user.name}
          </React.Fragment>
        )}
      </div>
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
});
