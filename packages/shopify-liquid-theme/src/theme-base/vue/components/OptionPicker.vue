<template>
  <RaOptionPicker
    v-bind="$attrs"
    class="product-form__option-picker mb-6"
    :class="
      asHorizontal
        ? 'product-form__option-picker--horizontal'
        : 'product-form__option-picker--square'
    "
    :style="asHorizontal ? horizontalStyles : defaultStyles"
  />
</template>

<script setup>
import { RaOptionPicker } from "@bva/ui-vue";

defineProps({
  asHorizontal: Boolean,
});

const defaultStyles = {};

const horizontalStyles = {
  "--picker-option-height": "var(--option-picker-horizontal-height)",
};
</script>
