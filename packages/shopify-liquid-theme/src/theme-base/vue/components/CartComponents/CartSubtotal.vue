<template>
  <div
    class="flex flex-row justify-between text-[18px] border-t border-grey-400 mb-[24px] pt-[16px]"
  >
    <span>SUBTOTAL:</span>
    <span>{{ $filters.money(subtotal) }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  subtotal: {
    type: Number,
    default: 0,
  },
});
</script>
