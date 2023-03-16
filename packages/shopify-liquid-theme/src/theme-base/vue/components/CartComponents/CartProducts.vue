<template>
  <template v-for="(product, i) in cart.items" :key="product.handle + '-' + i">
    <CartProductTile :product="product" />
  </template>
</template>

<script setup>
import { CartProductTile } from "./";

const props = defineProps({
  cart: {
    type: Object,
    default: () => {},
  },
});
</script>
