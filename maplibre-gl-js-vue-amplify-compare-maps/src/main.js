import AmplifyVue from '@aws-amplify/ui-vue';
import '@aws-amplify/ui-vue/styles.css';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import { Amplify } from 'aws-amplify';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createApp } from 'vue';
import App from './App.vue';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const app = createApp(App);
app.config.productionTip = false;
app.use(AmplifyVue);
app.mount('#app');
