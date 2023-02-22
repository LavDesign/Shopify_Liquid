<template>
  <div>Cart Message: {{ message.value }}</div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: Object,
    default: () => {},
  },
});
</script>
