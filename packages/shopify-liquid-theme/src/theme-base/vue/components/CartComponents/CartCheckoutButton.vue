<template>
  <button
    class="ra-button ra-button--full-width ra-button--sm -mb-[5px]"
    @click="navigateToCheckout"
  >
    Proceed to Checkout
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  checkoutReady: {
    type: Boolean,
    default: false,
  },
});

const checkoutReady = computed(() => {
  return props.checkoutReady;
});

const navigateToCheckout = () => {
  if (checkoutReady.value) {
    window.location.href = "/checkout";
  }
};
</script>
