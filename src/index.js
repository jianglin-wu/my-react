// import React from 'react';
// import ReactDOM from 'react-dom';
import ReReact from './lib/rereact';
import ReReactDOM from './lib/rereact-dom';
import './index.css';
// import App from './App';
import logo from './logo.svg';

ReReactDOM.render(
  // <App />,
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
