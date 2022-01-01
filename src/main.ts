import { createApp } from 'vue';
import App from './App.vue';
import './index.scss';

import GAuth from 'vue3-google-oauth2';

const gAuthOptions = {
  clientId:
    '829953456098-fimbade1e4l8fut03gkkm28vf73lhesb.apps.googleusercontent.com',
  prompt: 'consent'
};

const app = createApp(App);

app.use(GAuth, gAuthOptions);
app.mount('#app');
