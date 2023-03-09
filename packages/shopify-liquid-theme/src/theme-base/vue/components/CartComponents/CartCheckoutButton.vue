<template>
  <button
    class="ra-button ra-button--full-width ra-button--sm"
    :class="containerClasslist"
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
  containerClasslist: {
    type: String,
    default: "",
  },
});

const navigateToCheckout = () => {
  if (props.checkoutReady) {
    window.location.href = "/checkout";
  }
};
</script>
