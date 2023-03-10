<template>
  <div class="text-center" :class="containerClasslist" v-html="message" />
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: "",
  },
  containerClasslist: {
    type: String,
    default: "",
  },
});
</script>
