import React from 'react';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { Route, Switch } from 'react-router-dom';
import '../css/Main.css';
import { Provider as ApiProvider } from '../services/api/provider';
import AskResetPassword from './AskResetPassword';
import Contribute from './Contribute';
import Home from './Home';
import ResetPassword from './ResetPassword';

const options = {
  position: 'top center',
  timeout: 3000,
  offset: '30px',
  transition: 'scale'
};

const Main = () => {
  return (
    <ApiProvider>
      <AlertProvider template={AlertTemplate} {...options}>
        <Switch>
          <Route path="/contribute" component={Contribute} />
          <Route
            exact
            path="/resetpassword/:token/:email"
            component={ResetPassword}
          />
          <Route exact path="/resetpassword" component={AskResetPassword} />
          <Route exact path="/" component={Home} />
        </Switch>
      </AlertProvider>
    </ApiProvider>
  );
};

export default Main;
