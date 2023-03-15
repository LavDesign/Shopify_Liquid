<template>
  <div
    class="text-center"
    :style="messageColor"
    :class="containerClasslist"
    v-html="message"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  message: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  containerClasslist: {
    type: String,
    default: "",
  },
});

const messageColor = computed(() => `color: ${props.color};`);
</script>
