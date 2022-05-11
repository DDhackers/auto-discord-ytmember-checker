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
      <Async :loading="isFetching" class="flex justify-center w-full">
        <div
          v-if="isAuthed"
          class="info_card card bg-zinc-900 my-3 mx-auto sm:mx-0"
        >
          <div class="w-full">
            <div
              class="discord_banner bg-neutral-500 w-full"
              :class="{ got_banner: !isNoBanner(userInfo) }"
              :style="{ backgroundColor: userInfo.banner_color }"
            >
              <img
                v-if="!isNoBanner(userInfo)"
                :src="`https://cdn.discordapp.com/banners/${userInfo.id}/${userInfo.banner}?size=320`"
                class="w-full"
              />
            </div>
            <div class="p-3 relative">
              <div
                class="w-24 h-24 bg-zinc-900 p-1 absolute -top-12 rounded-full flex justify-center items-center"
              >
                <img
                  :src="`https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}?size=96`"
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

const discordClientId = inject('discordClientId');
const apiURL = inject('apiURL');

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

const toast: any = inject('toast');

const emit = defineEmits(['auth']);
const userInfo = ref<DiscordUser>({} as DiscordUser);
const isFetching = ref<boolean>(false);

const isAuthed = computed<boolean>(() => !!userInfo.value.id);
const isNoBanner = (userInfo: DiscordUser): Boolean =>
  userInfo.banner === null || userInfo.banner === 'null';

interface CallBackResponse {
  code: number;
  message: ApiResult;
}

interface ApiResult {
  Token: string;
  DiscordData: DiscordUser;
}

onMounted(() => {
  const discordData = sessionStorage.getItem('DiscordData');
  if (discordData) {
    userInfo.value = JSON.parse(discordData);
  }
  fetchGoogleData();
});

interface DiscordTokenRespnose {
  discordToken?: string;
  error?: any;
}

const fetchDiscordToken: AsynFn<DiscordTokenRespnose> = async () => {
  isFetching.value = true;
  const currentUrl = new URL(location.href);

  if (currentUrl.searchParams.get('state') != 'discord')
    return { error: 'invalid state' };
  const discordCode = currentUrl.searchParams.get('code');

  try {
    const result = await fetch(
      `${apiURL}/DiscordCallBack?code=${discordCode}`,
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
    const discordToken = response.message.Token;
    userInfo.value = response.message.DiscordData;

    sessionStorage.setItem('discord_token', discordToken);
    sessionStorage.setItem('DiscordData', JSON.stringify(userInfo.value));

    return { discordToken };
  } catch (error: any) {
    console.error(error);
    toast.error(`${error.message}`.trim());
    return { error };
  }
};

const fetchGoogleData: AsynFn<void> = async () => {
  try {
    const { discordToken, error } = await fetchDiscordToken();

    if (error) return;

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
    emit('auth', discordToken);

    if (response.code == 200) {
      //userInfo.value = response.message;
      //isAuthed.value = true;
    }
  } catch (error: any) {
    console.error(error);
    toast.error(`${error.message}`.trim());
  } finally {
    isFetching.value = false;
  }
};

const openDiscord = () => {
  if (isAuthed.value) return;
  location.href = `
    https://discord.com/api/oauth2/authorize?
    client_id=${discordClientId}&redirect_uri=${location.origin}/stream/login&response_type=code&
    scope=identify&
    state=discord
  `.replace(/\n| /g, '');
};
</script>

<style lang="scss">
.discord_banner {
  min-height: 60px;
  &.got_banner {
    min-height: 120px;
  }
}
</style>
