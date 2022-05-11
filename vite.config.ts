import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // https: {
    //   key: fs.readFileSync(`${__dirname}/src/assets/localhost-key.pem`),
    //   cert: fs.readFileSync(`${__dirname}/src/assets/localhost.pem`)
    // },
    host: '0.0.0.0',
    port: 3333
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: '/stream/',
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'login/index': resolve(__dirname, 'login/index.html'),
        'privacy/index': resolve(__dirname, 'privacy/index.html'),
        'terms/index': resolve(__dirname, 'terms/index.html')
      }
      // output: {
      //   dir: resolve(__dirname, 'dist/stream')
      // }
    }
  }
});
