import { createApp } from 'vue';
import App from './App.vue';
import './index.scss';

if (['/privacy', '/terms'].includes(location.pathname)) {
  //
} else {
  const app = createApp(App);

  app.provide(
    'googleClientId',
    '1001497098111-tbs3uidhom0r2p6gjaa8kqed4qp3oc61.apps.googleusercontent.com'
  );
  app.provide('discordClientId', '758222559392432160');
  app.provide('apiURL', 'https://api.konnokai.me');

  app.mount('#app');
}
