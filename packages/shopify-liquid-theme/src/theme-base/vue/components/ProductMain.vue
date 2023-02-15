<template>
  <div class="flex flex-row justify-between mb-3">
    <h1 class="h4">{{ product.title }}</h1>
    <div class="h4" v-if="currentVariant">
      <template v-if="showComparePrice">
        <span class="ra-price__special">{{
          $filters.money(currentVariant.price)
        }}</span>
        <span class="ra-price__old">{{
          $filters.money(currentVariant.compare_at_price)
        }}</span>
      </template>
      <template v-else>{{ $filters.money(currentVariant.price) }}</template>
    </div>
  </div>
  <slot name="review-stars"></slot>
  <ProductForm v-bind="{ product }" />
</template>

<script setup>
import { computed, onMounted, toRefs, useSlots } from "vue";
import { useProductPageStore } from "../stores/productPage";
import ProductForm from "./ProductForm.vue";
import { refreshReviewWidgets } from "../../js/utils";

const productStore = useProductPageStore();
const { currentVariant } = toRefs(productStore);

const props = defineProps({
  product: Object,
});

const showComparePrice = computed(() => {
  return currentVariant.value.compare_at_price > currentVariant.value.price;
});

const slots = useSlots();

onMounted(() => {
  if (slots["review-stars"]) {
    refreshReviewWidgets();
  }
});
</script>
