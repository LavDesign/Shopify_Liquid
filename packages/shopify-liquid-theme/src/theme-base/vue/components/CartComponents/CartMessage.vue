<template>
  <div class="mb-[32px] text-center">{{ message.value }}</div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: Object,
    default: () => {},
  },
});
</script>
