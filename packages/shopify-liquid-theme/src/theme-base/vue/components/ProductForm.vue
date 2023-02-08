<template>
  <template :key="optionKey" v-for="(options, optionKey) in formattedOptions">
    <SwatchPicker
      v-if="swatchOptions.includes(optionKey)"
      :label="optionKey"
      :options="options"
      :selected="selectedOptions[optionKey]"
      @change:option="
        (selected, option) => handleOptionSelect(optionKey, selected, option)
      "
    />

    <OptionPicker
      v-else
      :label="optionKey"
      :options="options"
      :selected="selectedOptions[optionKey]"
      :variant="getOptionVariant(optionKey)"
      @change:option="
        (selected, option) => handleOptionSelect(optionKey, selected, option)
      "
    />
  </template>

  <!-- Bug: @click event triggered on all @input events -->
  <RaAddToCart
    v-bind="{ buttonLabel, qty }"
    @input="(value) => (qty = value)"
    @click="addToCart"
    :disabled="!currentVariant.available"
    :buttonProps="{ disabled: true }"
  />
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useCartStore } from "../stores/cart";
import { RaAddToCart } from "@bva/ui-vue";
import SwatchPicker from "./SwatchPicker.vue";
import OptionPicker from "./OptionPicker.vue";

const props = defineProps({
  product: Object,
});

const store = useCartStore();

// ToDo: Add these values as a prop to pull from customizer
const dropdownOptions = [];
const swatchOptions = ["Color"];

function getOptionVariant(optionName) {
  if (dropdownOptions.includes(optionName)) {
    return "dropdown";
  }
  return "grid";
}

const optionsWithValues = reactive(props.product.options_with_values);

// Set initial options from first_available_variant
const selectedOptions = reactive({});

// Note: Insertion order should be preserved here as of ES2015 (assuming string keys),
// but there could be edge cases where options might not be properly ordered if using an int as a key
props.product.options.forEach((option, i) => {
  selectedOptions[option] = props.product.first_available_variant.options[i];
});

// Set keyed object for all option values
const formattedOptions = computed(() => {
  const formattedOptions = {};

  props.product.options.forEach((option) => {
    formattedOptions[option] = [];
    optionsWithValues[option].forEach((value) => {
      formattedOptions[option].push({
        label: value,
        dsiabled: true,
        value,
      });
    });
  });

  return formattedOptions;
});

const handleOptionSelect = (optionKey, selected, selectedOption) => {
  selectedOptions[optionKey] = selectedOption.value;
};

const hasComplexVariants = computed(() => {
  return props.product ? props.product.options.length > 1 : false;
});

const currentVariant = computed(() => {
  let currentVariant = props.product.variants[0];
  if (hasComplexVariants.value) {
    if (props.product.options.length > 2) {
      currentVariant = props.product.variants.find(
        (variant) =>
          variant.option1 === Object.values(selectedOptions)[0] &&
          variant.option2 === Object.values(selectedOptions)[1] &&
          variant.option3 === Object.values(selectedOptions)[2]
      );
    } else {
      currentVariant = props.product.variants.find(
        (variant) =>
          variant.option1 === Object.values(selectedOptions)[0] &&
          variant.option2 === Object.values(selectedOptions)[1]
      );
    }
  } else if (props.product.variants_count > 1) {
    currentVariant = props.product.variants.find(
      (variant) => variant.option1 === Object.values(selectedOptions)[0]
    );
  }
  return currentVariant || props.product.first_available_variant;
});

const buttonLabel = computed(() => {
  return isAddingToCart.value ? "Adding..." : "Add to Cart";
});

const qty = ref(1);
const isAddingToCart = ref(false);

const addToCart = async () => {
  isAddingToCart.value = true;
  await store.addItem({
    id: currentVariant.value.id,
    quantity: qty.value,
    // properties: null
  });
  isAddingToCart.value = false;
};
</script>
