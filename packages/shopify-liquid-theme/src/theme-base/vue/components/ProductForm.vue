<template>
  <h1>Test</h1>
  <RaOptionPicker
    label="size"
    size="lg"
    :options="[
      {
        value: '10',
        label: '10',
      },
    ]"
  />
</template>

<script setup>
import { ref, computed } from "vue";
// import axios from "axios";
// import store from "../../raStore.js";
import { RaOptionPicker } from "@bva/ui-vue";

const props = defineProps({
  product: Object,
});

console.log(props);

const quantity = ref(1)
const availableQuantity = ref(0);
const activeVariant = ref(null);
const enableBuyInStore = ref(true);
const enableBuyOnline = ref(true);
const selectedVariant = ref();
const selectedOption1 = ref();
const selectedOption2 = ref();
const selectedOption3 = ref();
const isAddingToCart = ref(false);

const buttonText = computed(() => {
  return this.isAddingToCart ? "Adding..." : "Add to Cart";
});


const currentVariant = computed(() => {
  let currentVariant = this.product.variants[0];
  if (this.hasComplexVariants) {
    if (this.product.options.length > 2) {
      currentVariant = this.product.variants.find(
        (variant) =>
          variant.option1 === this.selectedOption1 &&
          variant.option2 === this.selectedOption2 &&
          variant.option3 === this.selectedOption3
      );
    } else {
      currentVariant = this.product.variants.find(
        (variant) =>
          variant.option1 === this.selectedOption1 &&
          variant.option2 === this.selectedOption2
      );
    }
  } else if (this.hasVariants) {
    currentVariant = this.product.variants.find(
      (variant) => variant.option1 === this.selectedOption1
    );
  }
  return currentVariant || this.product.variants[0];
});

const hasComplexVariant = computed(() => {
  return this.product ? this.product.options.length > 1 : false;
});
</script>
