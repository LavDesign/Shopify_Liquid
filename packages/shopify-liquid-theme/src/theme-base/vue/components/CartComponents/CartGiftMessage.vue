<template>
  <div class="bg-grey-100 mb-[16px] p-[16px]">
    <label for="gift_message">
      <input type="checkbox" /> Add a gift message to your order?
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: Object,
    default: () => {},
  },
});
</script>
