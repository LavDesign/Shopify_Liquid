<template>
  <!-- Loop through options -->
  <RaOptionPicker
    :key="label"
    v-for="(options, label) in formattedOptions"
    :label="label"
    :options="formattedOptions[label]"
    :selected="selectedOptions[label]"
    @change:option="
      (selected, option) => handleOptionSelect(label, selected, option)
    "
  />
  <!-- Manually output all options for more granular control -->

  <!-- <RaOptionPicker
    :label="Object.keys(optionsWithValues)[0]"
    :options="formattedOptions[0]"
    :selected="selectedOptions[Object.keys(optionsWithValues)[0]]"
    @change:option="
      (selected, option) =>
        handleOptionSelect(Object.keys(optionsWithValues)[0], selected, option)
    "
  /> -->

  <!-- <RaOptionPicker
    v-if="Object.keys(optionsWithValues).length > 1"
    :label="Object.keys(optionsWithValues)[1]"
    variant="dropdown"
    :options="getFormattedValuesByIndex(1)"
    :selected="selectedOptions[Object.keys(optionsWithValues)[1]]"
    @change:option="handleDropdown"
  /> -->

  <!-- <RaOptionPicker
    v-if="Object.keys(optionsWithValues).length > 1"
    :label="Object.keys(optionsWithValues)[1]"
    :options="getFormattedValuesByIndex(1)"
    :selected="selectedOptions[Object.keys(optionsWithValues)[1]]"
    @change:option="
      (selected, option) =>
        handleOptionSelect(Object.keys(optionsWithValues)[1], selected, option)
    "
  /> -->

  <!-- <RaOptionPicker
    v-if="Object.keys(optionsWithValues).length > 2"
    :label="Object.keys(optionsWithValues)[2]"
    size="lg"
    variant="dropdown"
    :options="getFormattedValuesByIndex(2)"
    @change:option="
      (selected, selectedOption) =>
        handleDropdown(
          Object.keys(optionsWithValues)[0],
          selected,
          selectedOption
        )
    "
  /> -->
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { RaOptionPicker } from "@bva/ui-vue";

const props = defineProps({
  product: Object,
});

// ToDo:

// const quantity = ref(1);
// const availableQuantity = ref(0);
// const activeVariant = ref(null);
// const enableBuyInStore = ref(true);
// const enableBuyOnline = ref(true);
// const selectedVariant = ref();

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

const buttonText = computed(() => {
  return isAddingToCart.value ? "Adding..." : "Add to Cart";
});

const hasComplexVariants = computed(() => {
  return props.product ? props.product.options.length > 1 : false;
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
</script>
