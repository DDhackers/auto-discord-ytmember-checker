<template>
  <Header />
  <div class="h-14"></div>
  <div class="container mx-auto p-4">
    <Page404 v-if="isNotFound" />
    <HomePage v-else-if="isHompage" />
     <!--<VerifyWindow v-else-if="isLogin" />-->

    <div class="h-4"></div>
    
    <div v-if="isHompage" class="w-full flex justify-center">
    會限功能暫時停止登入
    </div>
    <!--<div v-if="isHompage" class="w-full flex justify-center">
      <a
        class="btn cursor-pointer bg-indigo-600 active:bg-indigo-500 mb-14"
        href="/stream/login"
      >
        點此開始驗證
      </a>
    </div>-->
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { computed } from 'vue';

//import VerifyWindow from './page/VerifyWindow.vue';
import HomePage from './page/HomePage.vue';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import Page404 from './page/Page404.vue';

const isNotFound = computed(() => {
  const path = window.location.pathname;

  return ![
    '/stream',
    '/stream/',
    '/stream/login',
    '/stream/login/',
    '/stream/privacy',
    '/stream/privacy/',
    '/stream/terms',
    '/stream/terms/'
  ].includes(path);
});

const isHompage = computed(
  () =>
    window.location.pathname === '/stream' ||
    window.location.pathname === '/stream/'
);
//const isLogin = computed(
//  () =>
//    window.location.pathname === '/stream/login' ||
//    window.location.pathname === '/stream/login/'
//);
</script>

<style scoped>
.container {
  min-height: calc(100vh - 112px);
}
</style>
