<template>
  <div class="w-full">
    <div class="flex justify-center sm:justify-start items-center">
      <div class="relative">
        <button
          class="btn bg-indigo-600"
          :class="{
            'active:bg-indigo-500': !isAuthed,
            'cursor-default': isAuthed
          }"
          @click="openDiscord"
        >
          {{ isAuthed ? '已驗證' : '開始驗證' }} discord
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

    <div class="flex mb-5">
      <Async
        :loading="isFetching"
        :class="isFetching ? ['flex', 'justify-center'] : ['w-full']"
      >
        <div
          v-if="isAuthed"
          class="info_card card bg-zinc-900 my-3 mx-auto sm:mx-0"
        >
          <div class="w-full">
            <div class="discord_banner bg-neutral-500 w-full">
              <img
                :src="`https://cdn.discordapp.com/banners/${userInfo.id}/${userInfo.banner}.png?size=320`"
                class="w-full"
              />
            </div>
            <div class="p-3 relative">
              <div
                class="w-24 h-24 bg-zinc-900 p-1 absolute -top-12 rounded-full flex justify-center items-center"
              >
                <img
                  :src="`https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png?size=64`"
                />
              </div>
              <div class="h-12"></div>
              <span class="font-bold text-white">{{ userInfo.username }}</span>
              <span class="font-bold text-zinc-400">
                #{{ userInfo.discriminator }}
              </span>
            </div>
          </div>
        </div>
      </Async>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ProgresserCircular from './ProgresserCircular.vue';
import Async from './Async.vue';

interface DiscordUser {
  accent_color: string;
  avatar: string;
  banner: string;
  banner_color: string;
  discriminator: string;
  flags: number;
  id: string;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  public_flags: number;
  username: string;
}

const emit = defineEmits(['auth']);
const userInfo = ref<DiscordUser>({} as DiscordUser);
const isFetching = ref<boolean>(false);

const isAuthed = computed<boolean>(() => !!userInfo.value.id);

onMounted(async () => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));

  const [accessToken, tokenType] = [
    fragment.get('access_token'),
    fragment.get('token_type')
  ];

  if (accessToken) {
    emit('auth', accessToken);
  }

  try {
    isFetching.value = true;
    const result = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${tokenType} ${accessToken}`
      }
    });
    const response = (await result.json()) as DiscordUser;
    userInfo.value = response;
  } catch (error) {
    console.error(error);
  } finally {
    isFetching.value = false;
  }
});

const openDiscord = () => {
  if (isAuthed.value) return;
  location.href =
    'https://discord.com/api/oauth2/authorize?client_id=748109225728933908&redirect_uri=http%3A%2F%2Flocalhost%3A3333&response_type=token&scope=identify';
};
</script>

<style lang="scss">
.discord_banner {
  min-height: 120px;
}
</style>
