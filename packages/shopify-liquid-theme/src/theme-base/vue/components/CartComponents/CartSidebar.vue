<template>
  <div class="basis-4/12 flex flex-col">
    <div class="pt-4 px-8 bg-white mb-4">
      <!-- FREE SHIPPING BAR -->
      <CartProgressBar
        v-if="settings.free_gift_enabled"
        :threshold="settings.free_gift_threshold"
        :subtotal="subtotal"
      />
      <!-- GIFT MESSAGE BOX -->
      <CartGiftMessage
        v-if="settings.gift_message_enabled"
        :note="cartRef.note"
        :attributes="attributes"
      />
      <!-- SPECIAL MESSAGE -->
      <CartMessage
        v-if="settings.cart_message_1?.length > 0"
        :message="settings.cart_message_1"
      />
      <!-- SUBTOTAL -->
      <CartSubtotal :subtotal="subtotal" />
      <!-- CHECKOUT CTA -->
      <CartCheckoutButton :checkout-ready="readyForCheckout" />
    </div>
    <!-- SPECIAL MESSAGE AGAIN-->
    <CartMessage
      v-if="settings.cart_message_2?.length > 0"
      :message="settings.cart_message_2"
    />
    <!-- YMAL -->
    <CartUpsell
      v-if="settings.upsell_enabled && settings.upsell_product"
      :product="settings.upsell_product"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
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

const cartRef = ref(props.cart);

const cart = computed(() => props.cart);

const settings = computed(() => props.settings);

const subtotal = computed(() => cart.value.total_price);

const attributes = computed(() => cart.value.attributes);

const note = computed(() => cart.value.note);

const showUpsell = computed(() => {
  const contains = cart.value.items.some(
    (item) => item.handle !== settings.value.upsell_product.handle
  );
  return contains;
});

const readyForCheckout = computed(() => {
  return cart.value.item_count > 0 && cart.value.items_subtotal_price > 0;
});
</script>
