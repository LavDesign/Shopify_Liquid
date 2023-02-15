<template>
  <div class="flex flex-row justify-between mb-3">
    <!-- <h1 class="h4">{{ product.title }}</h1> -->
    <div class="h4" v-if="currentVariant">
      {{ $filters.money(currentVariant.price) }}
    </div>
  </div>
  <slot name="review-stars"></slot>
  <ProductForm v-bind="{ product }" />
</template>

<script setup>
import { toRefs, useSlots } from "vue";
import ProductForm from "./ProductForm.vue";
import { useProductPageStore } from "../stores/productPage";

const productStore = useProductPageStore();
const { currentVariant } = toRefs(productStore);

const props = defineProps({
  product: Object,
});

const slots = useSlots();
if (slots["review-stars"]) {
  console.log("has slot");
}
</script>
