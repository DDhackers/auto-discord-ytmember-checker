<template>
  <div class="loader">
    <svg
      class="circular"
      :viewBox="`${Number(size) / 2} ${Number(size) / 2} ${size} ${size} `"
    >
      <circle
        class="path"
        :cx="size"
        :cy="size"
        :r="Number(size) / 2 - 5"
        fill="none"
        :stroke-width="width"
        :stroke="color"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: '#ffffff'
  },
  size: {
    type: [String, Number],
    default: 48
  },
  width: {
    type: [String, Number],
    default: 3
  }
});

const css_size = computed(() => `${props.size}px`);
</script>

<style>
.loader {
  position: relative;
  margin: 0px auto;
  width: v-bind(css_size);
  max-width: v-bind(css_size);
}

.loader:before {
  content: '';
  display: block;
  padding-top: 100%;
}

.circular {
  animation: rotate 2s linear infinite;
  height: 100%;
  transform-origin: center center;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.path {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke-linecap: round;
}

@keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
}
</style>
