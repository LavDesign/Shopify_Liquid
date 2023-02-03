<template>
  <RaOptionPicker
    :label="Object.keys(optionsWithValues)[0]"
    v-model="selectedOption1"
    :options="getFormattedValuesByIndex(0)"
  />
  <RaOptionPicker
    v-if="Object.keys(optionsWithValues).length > 1"
    :label="Object.keys(optionsWithValues)[1]"
    size="lg"
    variant="dropdown"
    v-model="selectedOption2"
    :options="getFormattedValuesByIndex(1)"
  />
  <RaOptionPicker
    v-if="Object.keys(optionsWithValues).length > 2"
    :label="Object.keys(optionsWithValues)[2]"
    size="lg"
    variant="dropdown"
    v-model="selectedOption3"
    :options="getFormattedValuesByIndex(2)"
  />
</template>

<script setup>
import { ref, computed } from "vue";
import { RaOptionPicker } from "@bva/ui-vue";

const props = defineProps({
  product: Object,
});

const quantity = ref(1);
const availableQuantity = ref(0);
const activeVariant = ref(null);
const enableBuyInStore = ref(true);
const enableBuyOnline = ref(true);
const selectedVariant = ref();
const selectedOption1 = ref("Small");
const selectedOption2 = ref("Black");
const selectedOption3 = ref();
const isAddingToCart = ref(false);

const optionsWithValues = props.product.options_with_values;

const buttonText = computed(() => {
  return isAddingToCart.value ? "Adding..." : "Add to Cart";
});

const hasComplexVariants = computed(() => {
  return props.product ? props.product.options.length > 1 : false;
});

function getFormattedValuesByIndex(index) {
  const key = Object.keys(optionsWithValues)[index];
  return optionsWithValues[key].map((value) => ({
    label: value,
    value: value,
  }));
}

const currentVariant = computed(() => {
  let currentVariant = props.product.variants[0];
  if (hasComplexVariants.value) {
    if (props.product.options.length > 2) {
      currentVariant = props.product.variants.find(
        (variant) =>
          variant.option1 === selectedOption1.value &&
          variant.option2 === selectedOption2.value &&
          variant.option3 === selectedOption3.value
      );
    } else {
      currentVariant = props.product.variants.find(
        (variant) =>
          variant.option1 === selectedOption1.value &&
          variant.option2 === selectedOption2.value
      );
    }
  } else if (props.product.variants_count > 1) {
    currentVariant = props.product.variants.find(
      (variant) => variant.option1 === selectedOption1.value
    );
  }
  return currentVariant || props.product.variants[0];
});
</script>
