<template>
  <div class="h-[44px] border border-black flex max-w-[124px]">
    <button class="w-[40px] border-r" @click="quantityDecrement">-</button>
    <input
      class="w-[44px] text-center text-lg"
      type="number"
      :value="quantity"
    />
    <button class="w-[40px] border-l" @click="quantityIncrement">+</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  quantity: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["quantityUpdated"]);

const quantity = ref(props.quantity);

watch(quantity, (newQuantity) => {
  emit("quantityUpdated", newQuantity);
});

const quantityDecrement = () => {
  quantity.value -= 1;
};

const quantityIncrement = () => {
  quantity.value += 1;
};
</script>
