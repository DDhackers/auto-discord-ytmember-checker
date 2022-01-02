import { createApp } from 'vue';
import App from './App.vue';
import './index.scss';

import { randomNAString } from './lib/random';

const tempToken: string =
  sessionStorage.getItem('tempToken') || randomNAString(64);
sessionStorage.setItem('tempToken', tempToken);

const app = createApp(App);

app.provide('tempToken', tempToken);
app.provide(
  'googleClientId',
  '829953456098-fimbade1e4l8fut03gkkm28vf73lhesb.apps.googleusercontent.com'
);
app.provide('discordClientId', '748109225728933908');

app.mount('#app');
