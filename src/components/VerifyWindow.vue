<template>
  <p class="text-5xl mb-3 flex items-center text-center sm:text-left">
    <img src="/DYML.png" class="w-20 h-20 mr-2" />
    Member Link
  </p>
  <div class="h-3"></div>
  <p>這是一個可自動驗證會員的應用程式</p>
  點擊下方按鈕完成
  <div class="h-4"></div>
  <DiscordSection @auth="(v) => (discordAccessToken = v)" />
  <div class="h-4"></div>
  <GoogleSection
    v-if="discordAccessToken"
    @auth="(v) => (googleAccessToken = v)"
  />

  <div class="h-4"></div>

  <div class="w-full flex justify-center sm:justify-start">
    <button
      v-if="!!googleAccessToken && !!discordAccessToken"
      class="btn bg-blue-700"
      @click="sendTokens"
    >
      <span>送出驗證</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import DiscordSection from './DiscordSection.vue';
import GoogleSection from './GoogleSection.vue';

import { randomNAString } from '../lib/random';

const googleAccessToken = ref<String>('');
const discordAccessToken = ref<String>('');

watchEffect(() => {
  if (!!googleAccessToken.value && !!discordAccessToken.value) {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 300);
  }
});

enum ResponseStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500
}

const sendTokens = async () => {
  const tempToken = randomNAString(64);
  console.log({
    tempToken,
    googleAccessToken: googleAccessToken.value,
    discordAccessToken: discordAccessToken.value
  });
};
</script>
