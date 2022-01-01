<template>
  <div>
    <ProgresserCircular v-if="isLoading" v-bind="$attrs"></ProgresserCircular>
    <slot v-if="shoudShowContent" :res="res"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import ProgresserCircular from './ProgresserCircular.vue';

const props = defineProps({
  fn: {
    type: Function,
    default: null
  },

  loading: {
    type: Boolean,
    default: false
  },

  inline: {
    type: Boolean,
    default: false
  },

  remainContent: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['load']);

const loadComplete = ref<boolean>(false);
const res = ref<any>(null);
const isLoading = computed<boolean>(() => props.loading || !loadComplete.value);
const shoudShowContent = computed<boolean>(
  () => !isLoading.value || props.remainContent
);

onMounted(async () => {
  if (props.fn) {
    res.value = await props.fn();
  }

  loadComplete.value = true;
  nextTick(() => {
    emit('load');
  });
});
</script>
