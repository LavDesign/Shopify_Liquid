<template>
  <div class="basis-4/12 flex flex-col bg-white">
    <div class="py-[16px] px-[24px]">
      <!-- FREE SHIPPING BAR -->
      <CartFreeShipping :subtotal="subtotal" />
      <!-- GIFT MESSAGE BOX -->
      <CartGiftMessage :message="giftMessage" />
      <!-- SPECIAL MESSAGE -->
      <CartMessage :message="message1" />
      <!-- SUBTOTAL -->
      <CartSubtotal :subtotal="subtotal" />
      <!-- CHECKOUT CTA -->
      <CartCheckoutButton />
      <!-- SPECIAL MESSAGE AGAIN-->
      <CartMessage :message="message2" />
    </div>
    <!-- YMAL -->
    <div></div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import {
  CartFreeShipping,
  CartSubtotal,
  CartCheckoutButton,
  CartGiftMessage,
  CartMessage,
} from "./";

const message1 = { value: 1 };
const message2 = { value: 2 };
const giftMessage = { value: 3 };

const props = defineProps({
  cart: {
    type: Object,
    default: () => {},
  },
});

const cart = computed(() => {
  return props.cart;
});

const subtotal = computed(() => {
  return cart.value.total_price;
});
</script>
