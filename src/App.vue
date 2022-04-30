<template>
  <div
    class="w-full fixed shadow-lg h-14 flex justify-space-between items-center bg-neutral-800 px-4"
  >
    <div class="left-side">
      <a href="/" class="cursor-pointer flex items-center">
        <img :src="favicon" class="w-12 h-12 mr-2" />
        直播小幫手
      </a>
    </div>
    <div class="flex-1"></div>
    <div class="right-side">
      <a class="btn cursor-pointer bg-indigo-600 active:bg-indigo-500">
        邀請機器人
      </a>
    </div>
  </div>
  <div class="h-14"></div>
  <div class="container mx-auto p-4">
    <HomePage v-if="isHompage" />
    <VerifyWindow v-else-if="isLogin" />

    <div class="h-14"></div>

    <div v-if="isHompage" class="w-full flex justify-center">
      <a
        class="btn cursor-pointer bg-indigo-600 active:bg-indigo-500 mb-14"
        href="/login"
      >
        點此開始驗證
      </a>
    </div>
  </div>
  <div
    class="w-full fixed shadow-lg h-14 flex justify-space-between items-center bg-neutral-800 px-4 bottom-0"
  >
    <div class="left-side flex items-center">
      <span class="text-sm">
        ©
        <a
          class="mx-1 underline text-indigo-300"
          href="https://github.com/jun112561"
          target="_blank"
        >
          孤之界
        </a>
        &
        <a
          class="mx-1 underline text-indigo-300"
          href="https://github.com/7Red4"
          target="_blank"
        >
          紅柿
        </a>
      </span>
    </div>
    <div class="flex-1"></div>
    <div class="right-side">
      <div>
        <a
          href="https://github.com/jun112561/Discord-Stream-Notify-Bot"
          target="_blank"
        >
          <svg
            width="24"
            height="24"
            fill="currentColor"
            class="text-indigo-300 mr-3 text-opacity-50 transform inline"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z"
            ></path>
          </svg>
        </a>
        <a href="/privacy" class="text-sm text-indigo-300 underline">
          隱私權政策
        </a>
        <span class="mx-1"></span>
        <a href="/terms" class="text-sm text-indigo-300 underline">使用條款</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import favicon from './assets/favicon.png';

import VerifyWindow from './components/VerifyWindow.vue';
import HomePage from './page/HomePage.vue';

const isHompage = computed(() => window.location.pathname === '/');
const isLogin = computed(() => window.location.pathname === '/login');
</script>
