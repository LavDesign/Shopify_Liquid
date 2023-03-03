<template>
  <RaSwatchPicker
    v-bind="$attrs"
    class="cart-tile__option-picker"
    size="xs"
    label=""
    shape="square"
    :fillSpace="false"
    variant="scrollable"
  />
</template>

<script setup>
import { RaSwatchPicker } from "@bva/ui-vue";
</script>
