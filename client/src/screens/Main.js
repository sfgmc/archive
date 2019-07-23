import React from 'react';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { Route, Switch } from 'react-router-dom';
import { Dashboard } from '../components/Dashboard';
import config from '../config';
import '../css/Main.css';
import { Provider as ApiProvider } from '../services/api/provider';
import { Auth0Provider, onRedirectCallback } from '../services/auth';
import PrivateRoute from '../services/auth/PrivateRoute';
import Home from './Home';

const options = {
  position: 'top center',
  timeout: 3000,
  offset: '30px',
  transition: 'scale'
};

const Main = () => {
  return (
    <Auth0Provider
      domain={config.auth0domain}
      client_id={config.auth0clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <ApiProvider>
        <AlertProvider template={AlertTemplate} {...options}>
          <Switch>
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <Route exact path="/" component={Home} />
          </Switch>
        </AlertProvider>
      </ApiProvider>
    </Auth0Provider>
  );
};

export default Main;
