<template>
  <div v-if="!upsellItemInCart">
    <h5 class="text-center mb-2">You may also like</h5>
    <CartUpsellTile :product="props.product" />
  </div>
</template>

<script setup>
import { useCartStore } from "../../stores/cart";
import { computed } from "vue";
import { CartUpsellTile } from "./";

const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
  products: {
    type: Array,
  },
});

const cartStore = useCartStore();

const items = computed(() => cartStore.cart.items);

const upsellItemInCart = computed(() =>
  items.value.some((item) => item.handle == props.product.handle)
);
</script>
