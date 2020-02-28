import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Importing libs
import { Report } from './libs';

// Importing assets
import example from './assets/example.json';
import logo from './assets/imgs/logo.svg';
import './index.scss';

class App extends Component {
  render() {
    return (
      <div className="report-test">
        <header className="report-test-header">
          <img src={logo} className="report-test-logo" alt="logo" />
          <h1 className="report-test-title">Welcome to React</h1>
        </header>
        <h1 className="report-test-intro">Example of 'react-data-report' Component.</h1>
        <br />
        <Report data={example}/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
