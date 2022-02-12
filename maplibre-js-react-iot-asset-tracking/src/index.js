import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import './index.css';

Amplify.configure(config);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
