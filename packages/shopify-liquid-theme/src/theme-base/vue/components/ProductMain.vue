<template>
  <Transition name="fade" appear>
    <div class="ra-product-main__inner">
      <h1 class="h4" v-text="title"></h1>
      <div class="h4" v-if="currentVariant">
        <template v-if="isComparePriceVisible">
          <span class="ra-price__special">{{
            $filters.money(currentVariant.price)
          }}</span>
          <span class="ra-price__old">{{
            $filters.money(currentVariant.compare_at_price)
          }}</span>
        </template>
        <template v-else>{{ $filters.money(currentVariant.price) }}</template>
      </div>
      <div v-if="!!$slots['review-stars']" class="mb-3">
        <slot name="review-stars"></slot>
      </div>
      <div v-html="description" class="mb-3"></div>
      <template v-if="$slots['size-guide']().length">
        <RaButton
          class="px-0 absolute right-0"
          asText
          size="xs"
          @click="showSizeGuide"
          >Size Guide</RaButton
        >
      </template>
      <ProductForm v-bind="{ product }" />
    </div>
  </Transition>
  <template v-if="$slots['size-guide']().length">
    <RaModal
      v-if="isSizeGuideActive"
      visible
      title="Size Guide"
      closeButtonIconSize="sm"
      @close:modal="hideSizeGuide"
    >
      <div class="pt-11">
        <slot name="size-guide"></slot>
      </div>
    </RaModal>
  </template>
</template>

<script setup>
import { ref, computed, onMounted, toRefs, useSlots } from "vue";
import { RaButton, RaModal } from "@bva/ui-vue";
import { useProductPageStore } from "../stores/productPage.js";
import ProductForm from "./ProductForm.vue";
import { refreshReviewWidgets } from "../../js/utils/vendors.js";

const productStore = useProductPageStore();
const { currentVariant } = toRefs(productStore);

const props = defineProps({
  product: Object,
});

const { title, description } = toRefs(props.product);

const isComparePriceVisible = computed(() => {
  return currentVariant.value.compare_at_price > currentVariant.value.price;
});

const isSizeGuideActive = ref(false);

const showSizeGuide = () => {
  isSizeGuideActive.value = true;
};

const hideSizeGuide = () => {
  isSizeGuideActive.value = false;
};

const slots = useSlots();

onMounted(() => {
  console.log(slots["review-stars"]().length);
  if (slots["review-stars"]().length) {
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
