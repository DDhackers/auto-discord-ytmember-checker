import { createApp } from 'vue';
import App from './App.vue';
import './index.css';

import GAuth from 'vue3-google-oauth2';

const gAuthOptions = {
  clientId: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
  scope: 'email',
  prompt: 'consent',
  fetch_basic_profile: false
};

const app = createApp(App);

app.use(GAuth, gAuthOptions);
app.mount('#app');
