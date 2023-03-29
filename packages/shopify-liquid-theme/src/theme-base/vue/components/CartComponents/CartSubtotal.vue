<template>
  <div
    class="flex flex-row justify-between text-[18px] border-t border-grey-400 mb-8 pt-4"
  >
    <span>SUBTOTAL:</span>
    <span>{{ $filters.money(subtotal) }}</span>
  </div>
</template>

<script setup>
defineProps({
  subtotal: {
    type: Number,
    default: 0,
  },
});
</script>
