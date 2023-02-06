<template>
  <template :key="optionKey" v-for="(options, optionKey) in formattedOptions">
    <RaSwatchPicker
      v-if="swatchOptions.includes(optionKey)"
      class="product-form__option-picker mb-[16px]"
      :label="optionKey"
      size="sm"
      shape="rounded"
      :fillSpace="false"
      :variant="getOptionVariant(optionKey)"
      :options="options"
      :selected="selectedOptions[optionKey]"
      @change:option="
        (selected, option) => handleOptionSelect(optionKey, selected, option)
      "
    />
    <RaOptionPicker
      v-else
      class="product-form__option-picker mb-[16px]"
      :label="optionKey"
      :variant="getOptionVariant(optionKey)"
      :options="options"
      :selected="selectedOptions[optionKey]"
      @change:option="
        (selected, option) => handleOptionSelect(optionKey, selected, option)
      "
    />
  </template>

  <!-- Dropdown Variant -->
  <!-- <RaOptionPicker
    v-if="Object.keys(optionsWithValues).length > 1"
    :label="Object.keys(optionsWithValues)[1]"
    variant="dropdown"
    :options="getFormattedValuesByIndex(1)"
    :selected="selectedOptions[Object.keys(optionsWithValues)[1]]"
    @change:option="handleDropdown"
  /> -->

  <!--
    Current Issue:
    How to handle with v-model?
  -->

  <RaAddToCart
    v-bind="{ buttonLabel, qty }"
    @input="(value) => (qty = value)"
  />
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { RaAddToCart, RaOptionPicker, RaSwatchPicker } from "@bva/ui-vue";

const props = defineProps({
  product: Object,
});

// ToDo: Add these values as a prop to pull from customizer
// const dropdownOptions = ["Material"];
const dropdownOptions = [];
const swatchOptions = ["Color"];

function getOptionVariant(optionName) {
  if (dropdownOptions.includes(optionName)) {
    return "dropdown";
  }
  return "grid";
}

const qty = ref(1);

const isAddingToCart = ref(false);
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
    // console.log(optionsWithValues);
    optionsWithValues[option].forEach((value) => {
      formattedOptions[option].push({
        label: value,
        value,
      });
    });
  });

  return formattedOptions;
});

const handleOptionSelect = (optionKey, selected, selectedOption) => {
  selectedOptions[optionKey] = selectedOption.value;
};

// // Currently Dropdown variation of the optionPicker component is firing events multiple times with different values
// const handleDropdown = (selected, selectedOption) => {
//   console.log(selected);
//   console.log(selectedOption);
//   // selectedOptions[optionKey] = selectedOption.value;
// };

const getFormattedValuesByIndex = (index) => {
  const key = Object.keys(optionsWithValues)[index];
  return optionsWithValues[key].map((value) => ({
    label: value,
    value: value,
  }));
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

const addToCart = (value) => {
  console.log(value);
  console.log("Adding to Cart.");
};
</script>
