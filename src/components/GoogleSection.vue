<template>
  <div>
    <div class="flex justify-center sm:justify-start items-center">
      <div class="relative">
        <button
          class="btn bg-red-600"
          :class="{
            'active:bg-red-500': !isAuthed,
            'cursor-default': isAuthed
          }"
          @click="openGoogle"
        >
          <Async :loading="!gAuth.isInit" :size="24">
            <span>{{ isAuthed ? '已驗證' : '開始驗證' }} google</span>
          </Async>
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
    <Async
      :loading="isFetching"
      :class="isFetching ? ['flex', 'justify-center'] : ['w-full']"
    >
      <div
        v-if="gAuth.isInit && isAuthed"
        class="info_card card my-3 bg-zinc-700 mx-auto sm:mx-0"
      >
        <img :src="basicProfile.getImageUrl()" />

        <div class="p-5">
          <p class="text-gray-300">{{ basicProfile.getEmail() }}</p>
          <p class="text-white font-bold">{{ basicProfile.getName() }}</p>
        </div>
      </div>
    </Async>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import ProgresserCircular from './ProgresserCircular.vue';
import Async from './Async.vue';

const gAuth: any = inject('Vue3GoogleOauth');
const emit = defineEmits(['auth']);

interface AuthResponse {
  token_type: string;
  access_token: string;
  scope: string;
  login_hint: string;
  expires_in: number;
  id_token: string;
  session_state: any;
  first_issued_at: number;
  expires_at: number;
  idpId: string;
}

interface BasicProfile {
  getEmail: () => string;
  getFamilyName: () => string;
  getGivenName: () => string;
  getId: () => string;
  getImageUrl: () => string;
  getName: () => string;
}

const isFetching = ref<boolean>(false);
const basicProfile = ref({} as BasicProfile);

const isAuthed = ref<boolean>(false);

const openGoogle = async () => {
  if (!gAuth.isInit || isAuthed.value) return;
  try {
    isFetching.value = true;
    const googleUser = await gAuth.instance.signIn();

    const { access_token } = googleUser.getAuthResponse() as AuthResponse;
    basicProfile.value = googleUser.getBasicProfile() as BasicProfile;

    isAuthed.value = true;

    emit('auth', access_token);
  } catch (error) {
    console.error(error);
  } finally {
    isFetching.value = false;
  }
};
</script>
