// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import  React  from  'react';
import  ReactDOM  from  'react-dom';
import  SamplePage from './SamplePage';
import  Amplify  from  'aws-amplify';
import  awsExports  from  './aws-exports';
import  './index.css';

Amplify.configure(awsExports);

ReactDOM.render(
  <React.StrictMode>
    <SamplePage />
  </React.StrictMode>,
  document.getElementById('map')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
