<template>
  <div class="basis-4/12 flex flex-col">
    <div class="pt-[16px] px-[24px] bg-white mb-[15px]">
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
    </div>
    <!-- SPECIAL MESSAGE AGAIN-->
    <CartMessage :message="message2" />
    <!-- YMAL -->
    <CartUpsell />
  </div>
</template>

<script setup>
import { computed } from "vue";
import {
  CartFreeShipping,
  CartSubtotal,
  CartCheckoutButton,
  CartGiftMessage,
  CartMessage,
  CartUpsell,
} from "./";

const message1 = {
  value:
    "This is a special message, it is meant to give the user any additional info they may need to see.",
};
const message2 = { value: "THIS IS A SPECIAL Message" };

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
