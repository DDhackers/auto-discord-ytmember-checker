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
      <strong class="text-indigo-400">
        discord
        <span class="cursor-pointer" @click="openLinkHint">
          (需連結 youtube)
        </span>
      </strong>
      以及
      <strong class="text-red-400">youtube (google 帳戶)</strong>
      授權
      <br />
      才有辦法為您做自動驗證
    </p>
    <div>
      <a href="/privacy" class="text-sm text-indigo-300 underline">
        隱私權政策
      </a>
      <span class="mx-1"></span>
      <a href="/terms" class="text-sm text-indigo-300 underline">使用條款</a>
    </div>
    <p class="mt-2">點擊下方按鈕完成</p>
  </div>
  <div class="h-4"></div>
  <div class="flex flex-wrap">
    <div class="w-full sm:w-1/2">
      <DiscordSection @auth="(v) => (discordAccessToken = v)" />
    </div>
    <div class="w-full sm:w-1/2">
      <GoogleSection
        @auth="(v) => (googleAccessToken = v)"
        @show-google-hint="isGoogleHintShow = true"
      />
    </div>
  </div>

  <div class="h-4"></div>

  <div class="w-full flex justify-center">
    <Async :loading="isTokenSending">
      <button
        v-if="!!googleAccessToken && !!discordAccessToken && !isSuccess"
        class="btn bg-blue-700"
        :class="{
          'bg-transparent': isSuccess,
          outline: isSuccess,
          'text-blue-500': isSuccess,
          'outline-blue-500': isSuccess,
          'cursor-default': isSuccess
        }"
        @click="sendTokens"
      >
        <span>{{ isSuccess ? '已完成驗證' : '送出驗證' }}</span>
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

  <Teleport to="body">
    <div class="layout" v-show="isDialogOpen" @click="isDialogOpen = false">
      <div class="layout-mask"></div>
      <Transition name="dialog">
        <div v-if="isDialogOpen" class="dialog-content">
          <div class="text-center">
            <img src="/link_youtube.png" />
            <p class="text-gray-400">[隨意點擊後關閉]</p>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>

  <Teleport to="body">
    <div
      class="layout"
      v-show="isGoogleHintShow"
      @click="isGoogleHintShow = false"
    >
      <div class="layout-mask"></div>
      <Transition name="dialog">
        <div v-if="isGoogleHintShow" class="dialog-content">
          <div
            class="bg-neutral-800 b-rad-4 p-4 flex flex-col items-center text-center"
          >
            <p>目前因為 google 的關係所以需要特別按連結才能正常登入</p>
            <p class="mb-2">點選左下角的進階，然後 "前往"</p>
            <img src="/google_auth_hint.jpg" class="mb-2" />
            <p class="my-2">並同意 YouTube 的授權</p>
            <img src="/agree_youtube_auth.png" />

            <p class="text-gray-400">[隨意點擊後關閉]</p>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { inject, provide, ref, watch, watchEffect } from 'vue';
import DiscordSection from './DiscordSection.vue';
import GoogleSection from './GoogleSection.vue';

import Async from './Async.vue';

const tempToken = inject('tempToken');
const apiURL = inject('apiURL');

const googleAccessToken = ref<string>('');
const discordAccessToken = ref<string>('');

const isTokenSending = ref<boolean>(false);
const isSuccess = ref<boolean>(false);
const isDialogOpen = ref<boolean>(false);
const isGoogleHintShow = ref<boolean>(true);
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
  if (!!googleAccessToken.value && !!discordAccessToken.value) {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 300);
  }
});

const openLinkHint = (): void => {
  isDialogOpen.value = true;
};

const sendTokens = async () => {
  if (isSuccess.value) return;
  isTokenSending.value = true;
  const payload = {
    DiscordAccessToken: discordAccessToken.value,
    GoogleToken: tempToken
  };

  try {
    const result = await fetch(`${apiURL}/login`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!result.ok) throw result;
    const res = await result.json();
    toastText.value = `${res.message}`.trim();
    isSuccess.value = true;

    history.replaceState(null, '', '/');
    sessionStorage.clear();
    localStorage.clear();
  } catch (error: any) {
    if (error.status) handleResponseError(error.status);
    if (error.message) errorText.value = `${error.message}`.trim();
  } finally {
    isTokenSending.value = false;
  }
};

enum ResponseStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500
}

const handleResponseError = (status: ResponseStatus): void => {
  switch (status) {
    case ResponseStatus.BAD_REQUEST:
      // errorText.value = '錯誤的請求';
      break;
    case ResponseStatus.UNAUTHORIZED:
      // errorText.value = '使用者未驗證';
      break;
    case ResponseStatus.TOO_MANY_REQUESTS:
      // errorText.value = '請求量過多';
      break;
    case ResponseStatus.INTERNAL_SERVER_ERROR:
      // errorText.value = '伺服器內部錯誤';
      break;

    default:
      // errorText.value = '未知的錯誤';
      break;
  }
};
</script>
