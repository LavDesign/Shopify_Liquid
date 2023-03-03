<template>
  <button
    class="ra-button ra-button--full-width ra-button--sm -mb-[5px]"
    @click="navigateToCheckout"
  >
    Proceed to Checkout
  </button>
</template>

<script setup>
const props = defineProps({
  checkoutReady: {
    type: Boolean,
    default: false,
  },
});

const navigateToCheckout = () => {
  if (props.checkoutReady) {
    window.location.href = "/checkout";
  }
};
</script>
