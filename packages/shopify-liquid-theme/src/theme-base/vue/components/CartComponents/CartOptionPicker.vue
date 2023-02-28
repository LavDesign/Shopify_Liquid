<template>
  <RaOptionPicker
    v-bind="$attrs"
    class="cart-tile__option-picker"
    variant="dropdown"
    size="lg"
    :label="false"
  />
</template>

<script setup>
import { RaOptionPicker } from "@bva/ui-vue";
</script>
