import ButtonMU from '@material-ui/core/Button';
import axios from 'axios';
import isEmail from 'is-email';
import React, { Component } from 'react';
import { withAlert } from 'react-alert';
import { Redirect } from 'react-router-dom';
import { Input } from 'semantic-ui-react';
import config from '../config';
import '../css/Main.css';

class AskResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: {
        email: ''
      },
      errors: {}
    };
  }

  // get query params - this.props.match.params.redirectParam

  // simple login
  sendResetEmail = e => {
    e.preventDefault();
    this.isInputEmpty();

    const isEmail = this.emailValitade(this.state.inputs.email); // value to know if the email is valid with the input from the state of where its called
    config.alertD('isEmail', isEmail);
    if (this.state.inputs.email && isEmail) {
      this.setState({ email: '' });
      axios
        .post(`${config.backEndServer}/resetpasswordemail`, {
          email: this.state.inputs.email
        })
        .then(res => {
          if (res.data != 'no user found') {
            this.props.alert.show(
              'Link to reset your account sent to your email'
            );
            setTimeout(() => this.setState({ redirectToLogin: true }), 4000);
          } else {
            this.props.alert.show('no user with that email was found');
          }
        })
        .catch(e => console.log('couldnt login', e));
    } else if (isEmail == false) {
      // if email is wrong format add the error to the errors object in state
      const { errors } = this.state;
      errors.isEmailErr = true;
      this.setState({ errors });
    }
  };

  // add the inputs values in theire [name] in state
  handleInput = e => {
    let target = e.target;
    let name = target.name;
    this.cleanErrors(name); // on each type clean the errors to remove the "error" mark on each input
    let value = target.value;
    const { inputs } = this.state;
    inputs[name] = value;
    this.setState({ inputs }, () => config.alertD(this.state.inputs[name])); // add the input in its proper property in the <inputs> object in state
  };

  // clean the errors from the <errors> object in the state
  cleanErrors = name => {
    const { errors } = this.state;
    errors[name] = false;
    errors.errStatus = '';
    if (name == 'email') {
      errors.isEmailErr = false;
    }
    this.setState({ errors });
  };

  // validate if the input is valid email
  emailValitade = email => {
    if (email != '') {
      return isEmail(email);
    }
  };

  // clean the errors from the <errors> object in the state
  isInputEmpty = () => {
    const { inputs, errors } = this.state;
    for (let key in inputs) {
      if (inputs[key].length == 0) {
        errors[key] = true;
      }
    }
    // if (inputs.password.length < 6) {
    //     errors.password = true;
    // }
    config.alertD('errors.password.length', errors.password);
    this.setState({ errors }, () => config.alertD(this.state.errors));
  };

  render() {
    return (
      <div className="admin-signup-section container-signup container">
        {this.state.redirectToLogin ? (
          <Redirect
            to={{
              pathname: '/admin',
              state: { askReset: true }
            }}
          />
        ) : null}
        <h3 className="forgot-pass">enter email</h3>
        <div>
          <div>
            <Input
              error={
                this.state.errors.email || this.state.errors.isEmailErr == true
                  ? true
                  : false
              }
              className="admin-form"
              onChange={e => this.handleInput(e)}
              value={this.state.inputs.email}
              name="email"
              type="text"
              placeholder="email"
            />
          </div>
          {this.state.errors.isEmailErr == true ? (
            <label style={{ color: 'red' }}>email invalid</label>
          ) : null}
          <br />
          <div>
            <ButtonMU
              variant="contained"
              color="primary"
              onClick={this.sendResetEmail}
            >
              reset
            </ButtonMU>
          </div>
        </div>
      </div>
    );
  }
}

export default withAlert(AskResetPassword);
