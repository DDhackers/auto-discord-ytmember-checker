<template>
  <p class="text-5xl mb-3 flex items-center text-center sm:text-left">
    <img src="/DYML.png" class="w-20 h-20 mr-2" />
    Member Link
  </p>
  <div class="h-3"></div>
  <p>這是一個可自動驗證會員的應用程式</p>
  <p>
    將會需要您的
    <strong class="text-indigo-400">discord</strong>
    以及
    <strong class="text-red-400">youtube</strong>
    授權
    <br />
    才有辦法為您做自動驗證
  </p>
  <p class="mt-2">點擊下方按鈕完成</p>
  <div class="h-4"></div>
  <DiscordSection @auth="(v) => (discordAccessToken = v)" />
  <div class="h-4"></div>
  <GoogleSection @auth="(v) => (googleAccessToken = v)" />

  <div class="h-4"></div>

  <div class="w-full flex justify-center sm:justify-start">
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
</template>

<script setup lang="ts">
import { inject, ref, watch, watchEffect } from 'vue';
import DiscordSection from './DiscordSection.vue';
import GoogleSection from './GoogleSection.vue';

import { randomNAString } from '../lib/random';
import Async from './Async.vue';

const tempToken = inject('tempToken');

const googleAccessToken = ref<string>('');
const discordAccessToken = ref<string>('');

const isTokenSending = ref<boolean>(false);
const isSuccess = ref<boolean>(false);
const errorText = ref<string>('');
const toastText = ref<string>('');

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

const sendTokens = async () => {
  if (isSuccess.value) return;
  isTokenSending.value = true;
  const payload = {
    DiscordAccessToken: discordAccessToken.value,
    GoogleToken: tempToken
  };

  try {
    const result = await fetch(`${location.origin}/v1/login`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    console.log({ result });

    if (!result.ok) throw result;
    toastText.value = '所有驗證都已完成 可以關閉此頁面了';
    isSuccess.value = true;
  } catch (error: any) {
    if (error.status) handleResponseError(error.status);
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
      errorText.value = '錯誤的請求';
      break;
    case ResponseStatus.UNAUTHORIZED:
      errorText.value = '使用者未驗證';
      break;
    case ResponseStatus.TOO_MANY_REQUESTS:
      errorText.value = '請求量過多';
      break;
    case ResponseStatus.INTERNAL_SERVER_ERROR:
      errorText.value = '伺服器內部錯誤';
      break;

    default:
      errorText.value = '未知的錯誤';
      break;
  }
};
</script>
