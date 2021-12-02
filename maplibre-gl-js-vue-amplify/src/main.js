import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'maplibre-gl/dist/maplibre-gl.css';

import { applyPolyfills, defineCustomElements } from '@aws-amplify/ui-components/loader';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

applyPolyfills().then(() => {
    defineCustomElements(window);
});

const app = createApp(App);
app.config.isCustomElement = (tag) => tag.startsWith('amplify-');
app.use(store).use(router).mount('#app');
