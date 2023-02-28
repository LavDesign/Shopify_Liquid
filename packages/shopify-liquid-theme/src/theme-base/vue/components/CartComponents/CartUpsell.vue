<template>
  <div>
    <h5 class="text-center mb-2">You may also like</h5>
    <CartUpsellTile v-bind="{ product }" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { CartUpsellTile } from "./";

const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
});

const product = computed(() => props.product);
</script>
