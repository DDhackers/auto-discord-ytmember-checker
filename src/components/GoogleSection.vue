<template>
  <div>
    <div class="flex justify-center items-center">
      <div class="relative">
        <button
          class="btn"
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
          <span>
            {{ isAuthed ? '已驗證' : '開始驗證' }} google
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 inline-block"
              viewBox="0 0 20 20"
              fill="currentColor"
              @click.stop="$emit('show-google-hint')"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
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
import { inject, onMounted, ref } from 'vue';
import Async from './Async.vue';

const toast: any = inject('toast');

const tempToken = inject('tempToken');
const googleClientId = inject('googleClientId');
const apiURL = inject('apiURL');

const emit = defineEmits(['auth', 'show-google-hint']);

interface UserInfo {
  UserName: string;
  UserAvatarUrl: string;
}

const isFetching = ref<boolean>(false);
const userInfo = ref({} as UserInfo);

const isAuthed = ref<boolean>(false);

interface CallBackResponse {
  code: number;
  message: UserInfo;
}

onMounted(async () => {
  const discordToken = sessionStorage.getItem('discord_token');
  if (discordToken)
  {
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

	  isAuthed.value = true;
	} catch (error: any) {
	  console.error(error);
	  toast.error(`${error.message}`.trim());
	} finally {
	  isFetching.value = false;
	}
  }
	
  const currentUrl = new URL(location.href);
  
  if (!currentUrl.searchParams.get('state')) return;
  
  const googleCode =
    currentUrl.searchParams.get('code') ||
    sessionStorage.getItem('google_code');

  if (!googleCode) return;
  sessionStorage.setItem('google_code', googleCode);

  isFetching.value = true;

  try {
    const result = await fetch(
      `${apiURL}/GoogleCallBack?code=${googleCode}&state=${tempToken}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    emit('auth', googleCode);

    if (!result.ok) throw result;
	
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

		isAuthed.value = true;
	  } catch (error: any) {
		console.error(error);
		toast.error(`${error.message}`.trim());
	  } finally {
		isFetching.value = false;
	  }	
  } catch (error: any) {
    console.error(error);
    toast.error(`${error.message}`.trim());
  } finally {
    isFetching.value = false;
  }
});

const openUrl = () => {
  if (isAuthed.value) return;
  const url: string = `https://accounts.google.com/o/oauth2/v2/auth?
    scope=https://www.googleapis.com/auth/userinfo.profile{{BLANK}}https%3A//www.googleapis.com/auth/youtube.force-ssl&
    access_type=offline&
    include_granted_scopes=true&
    response_type=code&
    state=${sessionStorage.getItem('discordToken')}&
    redirect_uri=${location.origin}&
    client_id=${googleClientId}`
    .replace(/\n| /g, '')
    .replace(/{{BLANK}}/g, ' ');

  location.href = url;
};
</script>
