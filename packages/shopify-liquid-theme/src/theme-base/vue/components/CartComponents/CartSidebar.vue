<template>
  <div class="basis-4/12 flex flex-col">
    <div class="pt-4 px-8 bg-white mb-4">
      <!-- FREE SHIPPING BAR -->
      <CartProgressBar
        v-if="props.settings.free_gift_enabled"
        :threshold="props.settings.free_gift_threshold"
        :subtotal="props.cart.total_price"
      />
      <!-- GIFT MESSAGE BOX -->
      <CartGiftMessage v-if="props.settings.gift_message_enabled" />
      <!-- SPECIAL MESSAGE -->
      <CartMessage
        v-if="props.settings.cart_message_1?.length > 0"
        :message="props.settings.cart_message_1"
      />
      <!-- SUBTOTAL -->
      <CartSubtotal :subtotal="props.cart.total_price" />
      <!-- CHECKOUT CTA -->
      <CartCheckoutButton :checkout-ready="readyForCheckout" />
    </div>
    <!-- SPECIAL MESSAGE AGAIN-->
    <CartMessage
      v-if="props.settings.cart_message_2?.length > 0"
      :message="props.settings.cart_message_2"
    />
    <!-- YMAL -->
    <CartUpsell
      v-if="props.settings.upsell_enabled && props.settings.upsell_product"
      :product="props.settings.upsell_product"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import {
  CartProgressBar,
  CartSubtotal,
  CartCheckoutButton,
  CartGiftMessage,
  CartMessage,
  CartUpsell,
} from "./";

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

const readyForCheckout = computed(() => {
  return props.cart.item_count > 0 && props.cart.items_subtotal_price > 0;
});
</script>
