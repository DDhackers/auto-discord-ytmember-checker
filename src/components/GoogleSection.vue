<template>
  <div>
    <div class="flex justify-center items-center">
      <div class="relative">
        <button
          class="btn static"
          :class="{
            'bg-red-600': !isAuthed,
            'active:bg-red-500': !isAuthed,
            'bg-transparent': isAuthed,
            outline: isAuthed,
            'text-red-500': isAuthed,
            'outline-red-500': isAuthed,
            'cursor-default': isAuthed
          }"
          @click="openUrl"
        >
          <span>{{ isAuthed ? '已驗證' : '開始驗證' }} google</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 ml-1 inline"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            @mouseover.stop="isHintOpen = true"
            @mouseleave.stop="isHintOpen = false"
            @click.stop
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <div class="hint text-xs" :class="{ active: isHintOpen }">
            獲得授權以後，機器人不會對您的 YouTube
            影片、評價、留言和字幕做出任何變更，只會讀取會員購買資格與記錄。我們不會將這些資訊用作直播小幫手會員認證以外的用途，敬請安心使用。
            另外本機器人皆有公開原始碼，有需要可自行查閱
          </div>
        </button>

        <svg
          v-if="isAuthed"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 inline absolute top-1/2 -translate-y-1/2"
          style="left: calc(100% + 8px)"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
    <div class="h-8"></div>
    <div class="flex justify-center items-center">
      <button
        v-if="isAuthed"
        class="btn bg-transparent text-red-500 outline-red-500"
        @click="unLink"
      >
        <Async :loading="isUnlinking">解除綁定</Async>
      </button>
    </div>
  </div>

  <div class="flex">
    <Async :loading="isFetching" class="flex justify-center w-full">
      <div
        v-if="isAuthed"
        class="info_card card my-3 bg-zinc-700 mx-auto sm:mx-0"
      >
        <img :src="userInfo.UserAvatarUrl" />

        <div class="p-5">
          <p class="text-white font-bold">{{ userInfo.UserName }}</p>
        </div>
      </div>
    </Async>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import Async from './Async.vue';

const toast: any = inject('toast');

const googleClientId = inject('googleClientId');
const apiURL = inject('apiURL');

const emit = defineEmits(['auth', 'show-google-hint']);

interface UserInfo {
  UserName: string;
  UserAvatarUrl: string;
}

const isFetchingByURL = ref<boolean>(false);
const isFetchingByDT = ref<boolean>(false);
const isUnlinking = ref<boolean>(false);
const isFetching = computed(
  () => isFetchingByURL.value || isFetchingByDT.value
);
const userInfo = ref({} as UserInfo);

const isAuthed = ref<boolean>(false);
const isHintOpen = ref<boolean>(false);

interface CallBackResponse {
  code: number;
  message: UserInfo;
}

onMounted(async () => {
  await fetchGoogleDataByURL();
  fetchGoogleData();
});

const fetchGoogleDataByURL: AsyncFn<void> = async () => {
  const currentUrl = new URL(location.href);

  if (currentUrl.searchParams.get('state') == 'discord') return;

  const googleCode = currentUrl.searchParams.get('code');

  const discordToken = sessionStorage.getItem('DT');

  if (!googleCode) return;
  if (!discordToken) return;

  isFetchingByURL.value = true;

  try {
    const result = await fetch(
      `${apiURL}/GoogleCallBack?code=${googleCode}&state=${discordToken}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!result.ok) throw result;
    window.history.replaceState({}, '', location.href.split('?')[0]);
  } catch (error: any) {
    console.error(error);
    toast.error(`${error.message}`.trim());
  } finally {
    isFetchingByURL.value = false;
  }
};

const fetchGoogleData: AsyncFn<void> = async () => {
  const discordToken = sessionStorage.getItem('DT');
  if (!discordToken) return;
  isFetchingByDT.value = true;
  try {
    const result = await fetch(
      `${apiURL}/GetGoogleData?token=${discordToken}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!result.ok) throw result;

    const response = (await result.json()) as CallBackResponse;
    if (response.code != 200) throw response;
    userInfo.value = response.message;
    emit('auth', true);

    isAuthed.value = true;
  } catch (error: any) {
    console.error(error);
    toast.error(`${error.message}`.trim());
  } finally {
    isFetchingByDT.value = false;
  }
};

const unLink: AsyncFn<void> = async () => {
  if (!isAuthed.value) return;
  const discordToken = sessionStorage.getItem('DT');
  if (!discordToken) return;
  isUnlinking.value = true;

  try {
    const result = await fetch(`${apiURL}/UnlinkGoogle?token=${discordToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!result.ok) throw result;

    const response = (await result.json()) as CallBackResponse;
    if (response.code != 200) throw response;

    isAuthed.value = false;
    toast('解除綁定成功');
  } catch (error: any) {
    console.error(error);
    toast.error(`${error.message}`.trim());
  } finally {
    isUnlinking.value = false;
  }
};

const openUrl = () => {
  if (isAuthed.value) return;
  const url: string = `
    https://accounts.google.com/o/oauth2/v2/auth?
      scope=https%3A//www.googleapis.com/auth/youtube.force-ssl&
      access_type=offline&
      include_granted_scopes=true&
      response_type=code&
      state=${sessionStorage.getItem('DT')}&
      redirect_uri=${location.origin}/stream/login&
      client_id=${googleClientId}
    `
    .replace(/\n| /g, '')
    .replace(/{{BLANK}}/g, ' ');

  location.href = url;
};
</script>

<style>
.hint {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translate(-50%, 0);
  @apply bg-slate-500 text-white rounded-lg p-4 w-80;
  z-index: 1;
}

.hint.active {
  display: block;
}
</style>
