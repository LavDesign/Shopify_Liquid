<template>
  <Transition name="fade" appear>
    <div class="ra-product-main__inner">
      <h1 class="h4" v-text="title"></h1>
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
      <div v-if="$slots['review-stars']" class="mb-3">
        <slot name="review-stars"></slot>
      </div>
      <div v-html="description" class="mb-3"></div>
      <ProductForm v-bind="{ product }" />
    </div>
  </Transition>
</template>

<script setup>
import { computed, onMounted, toRefs, useSlots } from "vue";
import { useProductPageStore } from "../stores/productPage";
import ProductForm from "./ProductForm.vue";
import { refreshReviewWidgets } from "../../js/utils/vendors";

const productStore = useProductPageStore();
const { currentVariant } = toRefs(productStore);

const props = defineProps({
  product: Object,
});

const { title, description } = toRefs(props.product);

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

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
