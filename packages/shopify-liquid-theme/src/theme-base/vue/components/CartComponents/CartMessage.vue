<template>
  <div class="mb-[32px] text-center">
    <div v-html="message"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: "",
  },
});
</script>
