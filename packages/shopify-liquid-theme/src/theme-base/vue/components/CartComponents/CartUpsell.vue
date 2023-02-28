<template>
  <div v-if="!upsellItemInCart">
    <h5 class="text-center mb-2">You may also like</h5>
    <CartUpsellTile v-bind="{ product }" />
  </div>
</template>

<script setup>
import { useCartStore } from "../../stores/cart";
import { computed } from "vue";
import { CartUpsellTile } from "./";

const cartStore = useCartStore();

const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
  products: {
    type: Array,
  },
});

const product = computed(() => props.product);
const items = computed(() => cartStore.cart.items);
const upsellItemInCart = computed(() =>
  items.value.some((item) => item.handle == product.value.handle)
);
</script>
