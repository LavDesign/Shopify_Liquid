<template>
  <div class="mb-10">
    <span class="text-center mb-2 block">
      <template v-if="remainingSpend > 0">
        You are {{ $filters.money(remainingSpend) }} away from free shipping
      </template>
      <template v-else>You have earned free shipping</template>
    </span>
    <div class="relative w-full h-2 bg-grey-200">
      <div
        class="absolute bg-[#000] top-0 bottom-0 !block transition-all ease-linear"
        :style="{ width: `${thresholdPercentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";

const props = defineProps({
  subtotal: {
    type: Number,
    default: 0,
  },
  threshold: {
    type: Number,
    default: 0,
  },
});

const remainingSpend = computed(() => props.threshold - props.subtotal);

const thresholdPercentage = computed(() => {
  const percentage = (props.subtotal * 100) / props.threshold;
  return Math.min(percentage, 100);
});
</script>
