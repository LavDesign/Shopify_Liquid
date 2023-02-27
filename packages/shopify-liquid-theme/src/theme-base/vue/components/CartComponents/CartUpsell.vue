<template>
  <div>
    <h5 class="text-center mb-2">You may also like</h5>
    <CartProductTile :product="upsellProduct" tile-type="upsell" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { CartProductTile } from "./";

const props = defineProps({
  upsellProduct: {
    type: Object,
    default: () => {},
  },
});

const upsellProduct = computed(() => props.upsellProduct);
</script>
