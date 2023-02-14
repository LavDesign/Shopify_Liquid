<template>
  <RaSwatchPicker
    v-bind="$attrs"
    class="product-form__option-picker mb-[16px]"
    size="sm"
    shape="rounded"
    :fillSpace="false"
    variant="grid"
  />
</template>

<script setup>
import { RaSwatchPicker } from "@bva/ui-vue";
</script>
