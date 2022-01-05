import { createApp } from 'vue';
import App from './App.vue';
import './index.scss';

import { randomNAString } from './lib/random';

if (['/privacy', '/terms'].includes(location.pathname)) {
  //
} else {
  const tempToken: string =
    sessionStorage.getItem('tempToken') || randomNAString(64);
  sessionStorage.setItem('tempToken', tempToken);

  const app = createApp(App);

  app.provide('tempToken', tempToken);
  app.provide(
    'googleClientId',
    '1001497098111-tbs3uidhom0r2p6gjaa8kqed4qp3oc61.apps.googleusercontent.com'
  );
  app.provide('discordClientId', '758222559392432160');
  app.provide('apiURL', 'https://api.junrasp.com');

  app.mount('#app');
}
