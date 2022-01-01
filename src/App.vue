<template>
  <div
    class="w-full fixed shadow-lg h-14 flex justify-center items-center bg-neutral-800"
  >
    <span class="font-bold">Discord YT member link</span>
  </div>
  <div class="h-14"></div>
  <div class="container mx-auto p-4">
    <VerifyWindow />
  </div>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import VerifyWindow from './components/VerifyWindow.vue';
</script>
