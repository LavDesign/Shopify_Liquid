<template>
  <template v-for="(product, i) in products" :key="product.handle + '-' + i">
    <CartProductTile :product="product" />
  </template>
</template>

<script setup>
import { computed } from "vue";
import CartProductTile from "./CartProductTile.vue";

const props = defineProps({
  cart: {
    type: Object,
    default: () => {},
  },
});

const products = computed(() => {
  return props.cart.items;
});
</script>
