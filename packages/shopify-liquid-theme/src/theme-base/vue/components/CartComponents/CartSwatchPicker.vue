<template>
  <RaSwatchPicker
    v-bind="$attrs"
    class="cart-tile__option-picker"
    size="xs"
    label=""
    shape="rounded"
    :fillSpace="false"
    variant="grid"
  />
</template>

<script setup>
import { RaSwatchPicker } from "@bva/ui-vue";
</script>
