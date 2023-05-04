<template>
  <RaOptionPicker
    v-bind="$attrs"
    class="product-form__option-picker mb-[16px]"
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
  "--picker-option-height": "3rem",
};
</script>
