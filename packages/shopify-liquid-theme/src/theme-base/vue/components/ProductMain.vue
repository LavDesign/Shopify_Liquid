<template>
  <div class="flex flex-row justify-between">
    <h1 class="h4">{{ product.title }}</h1>
    <div class="h4" v-if="currentVariant">
      {{ $filters.money(currentVariant.price) }}
    </div>
  </div>
  <ProductForm v-bind="{ product }" />
</template>

<script setup>
import { toRefs } from "vue";
import ProductForm from "./ProductForm.vue";
import { useProductPageStore } from "../stores/productPage";

const productStore = useProductPageStore();
const { currentVariant } = toRefs(productStore);

const props = defineProps({
  product: Object,
});
</script>
