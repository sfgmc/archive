/* @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
  Avatar,
  Button,
  Icon,
  Menu as EMenu,
  Popover,
  Position
} from 'evergreen-ui';
import React from 'react';
import { withRouter } from 'react-router';
import { useAuth0 } from '../services/auth';
// import { useRouter } from '../utils/useRouter';

export const menuCss = css`
  display: flex;
  position: fixed;
  left: 20px;
  top: 20px;
  z-index: 10;
`;

export const Menu = withRouter(({ history, ...props }) => {
  const {
    loading,
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
    loginWithPopup
  } = useAuth0();
  console.log({ user });
  const _ = React.useState();
  console.log({ history, props });
  return (
    <div css={menuCss}>
      <Popover
        position={Position.BOTTOM_LEFT}
        content={
          <EMenu>
            <EMenu.Group>
              <EMenu.Item icon="search-template">Search Archive</EMenu.Item>
              <EMenu.Item
                icon="dashboard"
                onSelect={() => history.push('/dashboard')}
              >
                Dashboard
              </EMenu.Item>
            </EMenu.Group>
            <EMenu.Divider />
            {!isAuthenticated && (
              <EMenu.Item icon="user" onSelect={() => loginWithRedirect()}>
                Login
              </EMenu.Item>
            )}
            {isAuthenticated && (
              <EMenu.Group title={`Logged in as ${user.name}`}>
                <EMenu.Item icon="person">Account</EMenu.Item>
                <EMenu.Item icon="key-enter" onSelect={() => logout()}>
                  Logout
                </EMenu.Item>
              </EMenu.Group>
            )}
          </EMenu>
        }
      >
        <Button>
          {!isAuthenticated && <Icon icon="menu" />}
          {isAuthenticated && <Avatar name={user.name} src={user.picture} />}
        </Button>
      </Popover>
    </div>
  );
});
