import { createApp } from 'vue';
import App from './App.vue';
import './index.css';

import GAuth from 'vue3-google-oauth2';

const gAuthOptions = {
  clientId:
    '1001497098111-tbs3uidhom0r2p6gjaa8kqed4qp3oc61.apps.googleusercontent.com',
  scope: 'email',
  prompt: 'consent',
  fetch_basic_profile: false
};

const app = createApp(App);

app.use(GAuth, gAuthOptions);
app.mount('#app');
