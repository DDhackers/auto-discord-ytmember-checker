<template>
  <div class="text-center">
    <p class="text-5xl mb-3 flex justify-center items-center">
      <img src="/DYML.png" class="w-20 h-20 mr-2" />
      Member Link
    </p>
    <div class="h-3"></div>
    <p>這是一個可自動驗證會員的應用程式</p>
    <p>
      將會需要您的
      <strong class="text-indigo-400">discord</strong>
      以及
      <strong class="text-red-400">youtube (google 帳戶)</strong>
      授權
      <br />
      才有辦法為您做自動驗證
    </p>
    <p>
      若您的伺服器未提供說明的話可
      <a
        href=" https://konnokai.notion.site/e69c579dc0ae4ff69866946d7dc36b8f"
        class="text-sm text-indigo-300 underline"
        target="_blank"
      >
	    參考此頁面
      </a>
    </p>
    <p class="mt-2">點擊下方按鈕完成</p>
  </div>
  <div class="h-4"></div>
  <div class="flex flex-wrap justify-center">
    <div class="w-full sm:w-1/2">
      <DiscordSection @auth="(v) => (hasDiscordAccessToken = v)" />
    </div>
    <div class="w-full sm:w-1/2" v-if="hasDiscordAccessToken">
      <GoogleSection @auth="(v) => (hasGoogleAccessToken = v)" />
    </div>
  </div>

  <div class="h-4"></div>

  <div class="w-full flex justify-center">
    <Async :loading="isTokenSending">
      <button
        v-if="hasGoogleAccessToken && hasDiscordAccessToken"
        class="btn bg-transparent outline text-blue-500 outline-blue-500 cursor-default"
      >
        <span>已完成綁定</span>
      </button>
    </Async>
  </div>

  <Teleport to="body">
    <Transition name="toast">
      <div v-if="errorText" class="toast bg-red-600">{{ errorText }}</div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toastText" class="toast bg-teal-600">{{ toastText }}</div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { provide, ref, watch, watchEffect } from 'vue';
import DiscordSection from '../components/DiscordSection.vue';
import GoogleSection from '../components/GoogleSection.vue';

import Async from '../components/Async.vue';

const hasGoogleAccessToken = ref<boolean>(false);
const hasDiscordAccessToken = ref<boolean>(false);

const isTokenSending = ref<boolean>(false);

const errorText = ref<string>('');
const toastText = ref<string>('');

const toast = (msg: string): void => {
  toastText.value = msg;
};
toast.error = (msg: string): void => {
  errorText.value = msg;
};

provide('toast', toast);

watch(
  () => errorText.value,
  () => {
    setTimeout(() => {
      errorText.value = '';
    }, 3000);
  }
);
watch(
  () => toastText.value,
  () => {
    setTimeout(() => {
      toastText.value = '';
    }, 3000);
  }
);

watchEffect(() => {
  if (hasGoogleAccessToken.value && hasDiscordAccessToken.value) {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 300);
  }
});
</script>
