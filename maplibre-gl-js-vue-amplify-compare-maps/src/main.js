import { createApp } from 'vue';
import App from './App.vue';
import {
  ElContainer,
  ElHeader,
  ElMain,
  ElRow,
  ElCol,
  ElCard,
  ElForm,
  ElFormItem,
  ElSwitch,
  ElSelect,
  ElInputNumber,
} from 'element-plus';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import 'maplibre-gl-js-amplify/dist/public/amplify-geocoder.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'element-plus/theme-chalk/index.css';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import '@aws-amplify/ui-vue/styles.css';
Amplify.configure(awsconfig);

const app = createApp(App);
app.config.productionTip = false;
app.use(ElContainer);
app.use(ElHeader);
app.use(ElMain);
app.use(ElRow);
app.use(ElCol);
app.use(ElCard);
app.use(ElForm);
app.use(ElFormItem);
app.use(ElSwitch);
app.use(ElSelect);
app.use(ElInputNumber);
app.mount('#app');
