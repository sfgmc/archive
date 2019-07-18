import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Main from './screens/Main'

class App extends Component {
  render() {
    return (
      <div>
        {/* <a href="https://github.com/obiwankenoobi/react-express-boilerplate" targer="_blank">
          <img
            style={{ position: 'absolute', top: 0, right: 0, border: 0 }}
            src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
            alt="Fork me on GitHub" />
        </a>


        <div style={{ position: 'absolute', top: 3, left: 3, border: 0 }}>
          <div>
            <a className="github-button" href="https://github.com/obiwankenoobi/react-express-boilerplate" data-icon="octicon-star" data-show-count="true" aria-label="Star obiwankenoobi/react-express-boilerplate on GitHub">Star</a>
          </div>
          <div>
            <a className="github-button" href="https://github.com/obiwankenoobi" aria-label="Follow @obiwankenoobi on GitHub">Follow @obiwankenoobi</a>
          </div>
        </div> */}


        <Main />
      </div>
    );
  }
}

export default App;
