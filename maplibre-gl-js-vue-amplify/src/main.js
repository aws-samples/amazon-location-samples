import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'maplibre-gl/dist/maplibre-gl.css';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const app = createApp(App);

app.use(router);

app.mount('#app');
