<template>
  <div class="w-full">
    <div class="flex justify-center items-center">
      <div class="relative">
        <button
          class="btn"
          :class="{
            'bg-indigo-600': !isAuthed,
            'active:bg-indigo-500': !isAuthed,
            'bg-transparent': isAuthed,
            outline: isAuthed,
            'text-indigo-500': isAuthed,
            'outline-indigo-500': isAuthed,
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
        :loading="isFetching || isFetchingConnection"
        class="flex justify-center w-full"
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
                  :src="`https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png?size=96`"
                  class="rounded-full"
                />
              </div>
              <div class="h-12"></div>
              <div>
                <span class="font-bold text-white">
                  {{ userInfo.username }}
                </span>
                <span class="font-bold text-zinc-400">
                  #{{ userInfo.discriminator }}
                </span>
              </div>

              <div class="h-4"></div>
              <div class="divider"></div>
              <div class="h-3"></div>

              <div v-if="connections.length" class="flex">
                <youtubeIcon class="h-7 inline mr-2" />
                {{ connections[0].name }}
              </div>
              <div v-else>未連結 youtube</div>
              <div class="h-3"></div>
            </div>
          </div>
        </div>
      </Async>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import Async from './Async.vue';
import youtubeIcon from '../assets/youtube.vue';

const discordClientId = inject('discordClientId');
const errorText = ref<string>('');

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

interface Connection {
  friend_sync: boolean;
  id: string;
  name: string;
  show_activity: boolean;
  type: string;
  verified: boolean;
  visibility: number;
}

const toast: any = inject('toast');

const emit = defineEmits(['auth']);
const userInfo = ref<DiscordUser>({} as DiscordUser);
const connections = ref<Array<Connection>>([]);
const isFetching = ref<boolean>(false);
const isFetchingConnection = ref<boolean>(false);

const isAuthed = computed<boolean>(() => !!userInfo.value.id);

onMounted(async () => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));

  const [accessToken] = [
    fragment.get('access_token') ||
      sessionStorage.getItem('discord_access_token')
  ];

  if (accessToken) {
    emit('auth', accessToken);
    sessionStorage.setItem('discord_access_token', accessToken);
  }

  const at: string | null = sessionStorage.getItem('discord_access_token');

  if (!at) return;

  fetchCurrentUser(at);
  fetchCurrentUserConnection(at);
});

const fetchCurrentUser = async (at: string): Promise<void> => {
  isFetching.value = true;
  try {
    const result = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${at}`
      }
    });
    const response = (await result.json()) as DiscordUser;
    userInfo.value = response;
  } catch (error: any) {
    console.error(error);
    toast.error(`${error}`);
  } finally {
    isFetching.value = false;
  }
};

const fetchCurrentUserConnection = async (at: string): Promise<void> => {
  isFetchingConnection.value = true;
  try {
    const result = await fetch(
      'https://discord.com/api/users/@me/connections',
      {
        headers: {
          authorization: `Bearer ${at}`
        }
      }
    );
    const response = (await result.json()) as Array<Connection>;
    connections.value = response.filter(({ type }) => type === 'youtube');
  } catch (error: any) {
    console.error(error);
    toast.error(`${error}`);
  } finally {
    isFetchingConnection.value = false;
  }
};

const openDiscord = () => {
  if (isAuthed.value) return;
  location.href = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=https%3A%2F%2Fdcbot.konnokai.me%2Fstream%2Flogin%2FDiscordCallBack&response_type=token&scope=connections%20identify`;
};
</script>

<style lang="scss">
.discord_banner {
  min-height: 120px;
}
</style>
