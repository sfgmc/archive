import ButtonMU from '@material-ui/core/Button';
import axios from 'axios';
import isEmail from 'is-email';
import React, { Component } from 'react';
import { withAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { Input } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { Dashboard } from '../components/Dashboard';
import config from '../config';
import '../css/Main.css';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: {
        password: '',
        email: ''
      },
      errors: { isEmailErr: false },
      username: JSON.parse(localStorage.getItem('user'))
        ? JSON.parse(localStorage.getItem('user')).username
        : '', // username
      token: JSON.parse(localStorage.getItem('user'))
        ? JSON.parse(localStorage.getItem('user')).token
        : '' // user access token
    };
    if (config.__DEGUGGING__) {
      console.log('this username', this.state.username);
    }
  }

  componentDidMount() {
    // check if user rediret from password reseting
    if (
      this.props.location.state &&
      (this.props.location.state.reset || this.props.location.state.askReset)
    ) {
      this.setState({ isHaveAccount: true }); // open login and not signup
    }
  }

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

  // clean the errors from the <errors> object in the state
  isInputEmpty = () => {
    const { inputs, errors } = this.state;
    for (let key in inputs) {
      if (inputs[key].length == 0) {
        errors[key] = true;
      }
    }
    if (inputs.password.length < 6) {
      errors.password = true;
    }
    config.alertD('errors.password.length', errors.password);
    this.setState({ errors }, () => config.alertD(this.state.errors));
  };

  // removing isHaveAccount flag to show the signup
  moveToSignup = e => {
    this.setState({ isHaveAccount: !this.state.isHaveAccount });
  };

  // validate if the input is valid email
  emailValitade = email => {
    if (email != '') {
      return isEmail(email);
    }
  };

  // simple signup
  Signup = e => {
    e.preventDefault();

    const isEmail = this.emailValitade(this.state.inputs.email); // value to know if the email is valid with the input from the state of where its called
    this.isInputEmpty();
    config.alertD('this.state.inputs.email', this.state.inputs.email);
    config.alertD('this.state.inputs.password', this.state.inputs.password);
    config.alertD('isEmail', isEmail);
    if (
      isEmail &&
      this.state.inputs.email &&
      this.state.inputs.password &&
      this.state.inputs.password.length >= 6
    ) {
      config.alertD('signup');
      axios
        .post(`${config.backEndServer}/signup`, {
          username: this.state.inputs.email,
          password: this.state.inputs.password,
          dateOfRegistration: new Date()
        })
        .then(res => {
          config.alertD('this user res on login ', res.data);
          if (res.data.name == 'UserExistsError') {
            // check if email exist from Passport
            config.alertD('email exist');
            let errStatus = res.data.name;
            const { errors } = this.state;
            errors.errStatus = errStatus;
            this.setState({ errors });
          } else {
            this.props.alert.show('Please check your email to confirm account');
            setTimeout(() => this.setState({ isHaveAccount: true }), 4000);
          }
        })
        .catch(e => console.log('couldnt signup', e));
    } else if (isEmail == false) {
      // if email is wrong format add the error to the errors object in state
      const { errors } = this.state;
      errors.isEmailErr = true;
      this.setState({ errors });
    } else {
      config.alertD('couldnt do it');
    }
  };

  // simple login
  Login = e => {
    e.preventDefault();
    this.isInputEmpty();
    config.alertD('this.state.inputs.email', this.state.inputs.email);
    config.alertD('this.state.inputs.password', this.state.inputs.password);
    const isEmail = this.emailValitade(this.state.inputs.email); // value to know if the email is valid with the input from the state of where its called
    if (isEmail && this.state.inputs.email && this.state.inputs.password) {
      axios
        .post(`${config.backEndServer}/login`, {
          username: this.state.inputs.email,
          password: this.state.inputs.password
        })
        .then(res => {
          config.alertD('this user res on login ', res.data);
          if (res.data.user) {
            const user = res.data.user;
            this.setState(
              {
                username: user.username,
                token: res.data.token
              },
              () => {
                localStorage.setItem(
                  'user',
                  JSON.stringify({
                    username: user.username,
                    token: res.data.token
                  })
                );
              }
            );
          }
        })
        .catch(e => {
          // if there is n error - catching the response status to handle the error (usualy 401 for wrong data)
          let errStatus = e.response.status;
          const { errors } = this.state;
          errors.errStatus = errStatus.toString();
          this.setState({ errors });
        });
    } else if (isEmail == false) {
      // if email is wrong format add the error to the errors object in state
      const { errors } = this.state;
      errors.isEmailErr = true;
      this.setState({ errors });
    } else {
      config.alertD('couldnt do it');
    }
  };

  // simple logout call
  Logout = e => {
    e.preventDefault();
    axios
      .post(`${config.backEndServer}/logout`, {
        username: JSON.parse(localStorage.getItem('user')).username
      })
      .then(res => {
        this.setState({ username: '' }, () => {
          localStorage.clear(); // clearing the local storage
          window.location.reload(); // refreshing the page with the new local storage
        });
      })
      .catch(e => console.log('logout', e));
  };

  protectedRoute = () => {
    axios
      .post(`${config.backEndServer}/protected`, {
        token: this.state.token // passing the token to access the route
      })
      .then(() => {
        Swal('yey', 'awesome! I see you signed in(:', 'success'); // show if the token is right
      })
      .catch(e => {
        if (e) {
          Swal('oops', 'login to see it(:', 'error'); // show if token is wrong or there is no token passed
        }
      });
  };

  render() {
    const username = this.state.username;
    const token = this.state.token;

    return (
      <div className="">
        {token ? ( // checking if there is a token
          <div className="admin-signup-section container-signup container">
            <div>
              <Dashboard onLogout={this.Logout} />
            </div>
          </div>
        ) : (
          <div className="admin-signup-section container-signup container">
            {this.state.isHaveAccount ? ( // checking if the user have account and render the login or signup based on that
              <div>
                <h3>Login</h3>
                <div>
                  <div>
                    <Input
                      error={
                        this.state.errors.email ||
                        this.state.errors.isEmailErr == true
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
                    <Input
                      error={this.state.errors.password ? true : false}
                      className="admin-form"
                      onChange={e => this.handleInput(e)}
                      value={this.state.inputs.password}
                      name="password"
                      type="password"
                      placeholder="password"
                    />
                  </div>

                  {this.state.errors.errStatus == '401' ? (
                    <label style={{ color: 'red' }}>
                      the password or email are wrong
                    </label>
                  ) : null}
                  {this.state.errors.isEmailErr == true ? (
                    <label style={{ color: 'red' }}>email invalid</label>
                  ) : null}

                  <br />

                  <div>
                    <ButtonMU
                      className="btn-signup"
                      variant="contained"
                      color="primary"
                      onClick={this.Login}
                    >
                      Login
                    </ButtonMU>
                    <ButtonMU
                      className="btn-signup"
                      variant="contained"
                      color="primary"
                      onClick={e => this.moveToSignup(e)}
                    >
                      I dont have account
                    </ButtonMU>
                  </div>

                  <br />

                  <Link
                    style={{ textDecoration: 'none' }}
                    to={{ pathname: '/resetpassword' }}
                  >
                    <ButtonMU
                      className="btn-signup"
                      variant="outlined"
                      color="primary"
                    >
                      forgot password?
                    </ButtonMU>
                  </Link>
                  <ButtonMU
                    className="btn-signup"
                    variant="contained"
                    color="primary"
                    onClick={this.protectedRoute}
                  >
                    Protected route (:
                  </ButtonMU>
                </div>
              </div>
            ) : (
              <div>
                <h3>Signup</h3>
                <div>
                  <div>
                    <Input
                      error={
                        this.state.errors.email ||
                        this.state.errors.isEmailErr == true
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
                    <Input
                      error={this.state.errors.password ? true : false}
                      className="admin-form"
                      onChange={e => this.handleInput(e)}
                      value={this.state.inputs.password}
                      name="password"
                      type="password"
                      placeholder="password"
                    />
                  </div>

                  {this.state.errors.errStatus == 'UserExistsError' ? (
                    <label style={{ color: 'red' }}>email exist</label>
                  ) : null}
                  {this.state.inputs.password.length < 6 &&
                  this.state.errors.password ? (
                    <label style={{ color: 'red' }}>
                      &nbsp; pw must be at least 6 chars
                    </label>
                  ) : null}
                  {this.state.errors.isEmailErr == true ? (
                    <label style={{ color: 'red' }}>&nbsp; email invalid</label>
                  ) : null}

                  <br />
                  <div>
                    <ButtonMU
                      className="btn-signup"
                      variant="contained"
                      color="primary"
                      onClick={this.Signup}
                    >
                      Signup
                    </ButtonMU>
                    <ButtonMU
                      className="btn-signup"
                      variant="contained"
                      color="primary"
                      onClick={() => this.moveToSignup()}
                    >
                      I have account
                    </ButtonMU>
                  </div>

                  <br />
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={{ pathname: '/' }}
                  >
                    <ButtonMU
                      className="btn-signup"
                      variant="outlined"
                      color="primary"
                    >
                      Home
                    </ButtonMU>
                  </Link>
                  <ButtonMU
                    className="btn-signup"
                    variant="contained"
                    color="primary"
                    onClick={this.protectedRoute}
                  >
                    Protected route (:
                  </ButtonMU>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default withAlert(Admin);
