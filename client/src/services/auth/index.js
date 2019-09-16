import createAuth0Client from '@auth0/auth0-spa-js';
import React, { useContext, useEffect, useState } from 'react';

const DEFAULT_REDIRECT_CALLBACK = () => window.location.pathname;

export const Auth0Context = React.createContext({});
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [token, setToken] = useState();

  useEffect(() => {
    if (token) {
      window.localStorage.setItem('token', token);
      return;
    }
    window.localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
        const token = await auth0FromHook.getTokenSilently();
        setToken(token);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = React.useCallback(
    async (params = {}) => {
      if (!auth0Client) return;
      setPopupOpen(true);
      try {
        await auth0Client.loginWithPopup(params);
      } catch (error) {
      } finally {
        setPopupOpen(false);
      }
      const user = await auth0Client.getUser();
      setUser(user);
      const token = await auth0Client.getTokenSilently();
      setToken(token);
      setIsAuthenticated(true);
    },
    [auth0Client]
  );

  const handleRedirectCallback = React.useCallback(async () => {
    if (!auth0Client) return;
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const token = await auth0Client.getTokenSilently();
    const user = await auth0Client.getUser();

    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
    setToken(token);
  }, [auth0Client]);
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: React.useCallback(
          (...p) => auth0Client && auth0Client.getIdTokenClaims(...p),
          [auth0Client]
        ),
        loginWithRedirect: React.useCallback(
          (...p) => auth0Client && auth0Client.loginWithRedirect(...p),
          [auth0Client]
        ),
        getTokenSilently: React.useCallback(
          (...p) => auth0Client && auth0Client.getTokenSilently(...p),
          [auth0Client]
        ),
        getTokenWithPopup: React.useCallback(
          (...p) => auth0Client && auth0Client.getTokenWithPopup(...p),
          [auth0Client]
        ),
        logout: React.useCallback(
          (opts, ...p) => {
            auth0Client &&
              auth0Client.logout(
                {
                  returnTo: window.location.href.split('?')[0],
                  ...opts
                },
                ...p
              );
          },
          [auth0Client]
        )
      }}
    >
      {loading && 'Loading'}
      {!loading && children}
    </Auth0Context.Provider>
  );
};

export const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};
