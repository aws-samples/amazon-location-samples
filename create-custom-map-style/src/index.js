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

