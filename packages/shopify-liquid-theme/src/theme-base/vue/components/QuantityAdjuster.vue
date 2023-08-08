<template>
  <div
    aria-label="Quantity"
    class="ra-quantity-selector ra-quantity-selector--input"
  >
    <button
      type="button"
      aria-label="Decrement Quantity"
      class="ra-quantity-selector__button--minus ra-quantity-selector__button ra-button ra-icon-button ra-icon-button--tertiary ra-icon-button--square"
      @click="quantityDecrement"
    >
      <svg class="ra-icon">
        <use xlink:href="#minus"></use>
      </svg>
    </button>
    <div class="ra-input ra-quantity-selector__input is-filled">
      <div class="ra-input__wrapper">
        <input
          type="number"
          class="ra-input__control ra-input__control--text"
          :value="quantity"
          min="0"
          @input="quantitySet($event)"
        />
      </div>
    </div>
    <button
      type="button"
      aria-label="Increment Quantity"
      class="ra-quantity-selector__button--plus ra-quantity-selector__button ra-button ra-icon-button ra-icon-button--tertiary ra-icon-button--square"
      @click="quantityIncrement"
    >
      <svg class="ra-icon">
        <use xlink:href="#plus"></use>
      </svg>
    </button>
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

const debounce = (fn, wait) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
};

watch(
  quantity,
  debounce((newQuantity) => {
    emit("quantityUpdated", newQuantity);
  }),
  500
);

const quantityDecrement = () => {
  quantity.value -= 1;
  if (quantity.value < 0) {
    quantity.value = 0;
  }
};

const quantityIncrement = () => {
  quantity.value += 1;
};

const quantitySet = (e) => {
  quantity.value = e.target.value;
};
</script>
