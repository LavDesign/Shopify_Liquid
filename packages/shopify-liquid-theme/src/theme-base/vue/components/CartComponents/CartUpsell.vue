<template>
  <div v-if="!upsellItemInCart" :class="containerClasslist">
    <h5 class="text-center text-transform--uppercase mb-2">
      You may also like
    </h5>
    <CartUpsellTile :product="product" />
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
  containerClasslist: {
    type: String,
    default: "",
  },
});

const cartStore = useCartStore();

const items = computed(() => cartStore.cart.items);

const upsellItemInCart = computed(() =>
  items.value.some((item) => item.handle == props.product.handle)
);
</script>
