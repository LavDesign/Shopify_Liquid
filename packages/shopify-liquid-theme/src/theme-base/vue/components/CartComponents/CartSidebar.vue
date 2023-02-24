<template>
  <div class="basis-4/12 flex flex-col">
    <div class="pt-[16px] px-[24px] bg-white mb-[15px]">
      <!-- FREE SHIPPING BAR -->
      <CartProgressBar
        v-if="settings.free_gift_enabled"
        :threshold="settings.free_gift_threshold"
        :subtotal="subtotal"
      />
      <!-- GIFT MESSAGE BOX -->
      <CartGiftMessage v-if="settings.gift_message_enabled" />
      <!-- SPECIAL MESSAGE -->
      <CartMessage
        v-if="settings.cart_message_1.length > 0"
        :message="settings.cart_message_1"
      />
      <!-- SUBTOTAL -->
      <CartSubtotal :subtotal="subtotal" />
      <!-- CHECKOUT CTA -->
      <CartCheckoutButton :checkout-ready="readyForCheckout" />
    </div>
    <!-- SPECIAL MESSAGE AGAIN-->
    <CartMessage
      v-if="settings.cart_message_2.length > 0"
      :message="settings.cart_message_2"
    />
    <!-- YMAL -->
    <CartUpsell
      v-if="settings.upsell_enabled"
      :upsell-product="settings.upsell_product"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCartStore } from "../../stores/cart";
import {
  CartProgressBar,
  CartSubtotal,
  CartCheckoutButton,
  CartGiftMessage,
  CartMessage,
  CartUpsell,
} from "./";

const cartStore = useCartStore();

const props = defineProps({
  cart: {
    type: Object,
    default: () => {},
  },
  settings: {
    type: Object,
    default: () => {},
  },
});

const cart = computed(() => {
  return props.cart;
});

const settings = computed(() => {
  return props.settings;
});

const subtotal = computed(() => {
  return cart.value.total_price;
});

const readyForCheckout = computed(() => {
  return cart.value.item_count > 0 && cart.value.items_subtotal_price > 0;
});
</script>
