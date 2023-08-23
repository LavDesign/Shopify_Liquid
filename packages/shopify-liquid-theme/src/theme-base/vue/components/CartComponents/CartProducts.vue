<template>
  <span>
    <div v-for="(product, i) in cart.items" :key="product.handle + '-' + i">
      <CartProductTile :product="product" :qty="product.quantity" />
    </div>
  </span>
</template>

<script setup>
import { CartProductTile } from "./";

defineProps({
  cart: {
    type: Object,
    default: () => {},
  },
});
</script>
