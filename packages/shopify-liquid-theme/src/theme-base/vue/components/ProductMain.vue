<template>
  <ProductForm v-bind="{ product }" />
</template>

<script setup>
import ProductForm from "./ProductForm.vue";

const props = defineProps({
  product: Object,
});
</script>
