<template>
  <Transition name="cart" mode="out-in">
    <template v-if="cartReady">
      <div
        v-if="cartHasItems"
        class="mx-auto flex flex-col md:flex-row justify-between"
      >
        <div class="basis-1/2 p-4 md:p-0">
          <h3 class="mb-6 text-center md:text-left">
            {{ settings.cart_header_text }}
          </h3>
          <CartProducts :cart="cart" />
        </div>
        <CartSidebar
          class="basis-4/12 flex flex-col p-4 md:p-0 bg-white md:bg-transparent"
          v-bind="{ cart, settings }"
        />
      </div>
      <div
        v-else-if="cartIsEmpty"
        class="text-center mt-4 flex flex-col items-center pt-[88px] pb-32"
      >
        <EmptyCart :settings="emptyCartSettings" />
      </div>
    </template>
  </Transition>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useCartStore } from "../stores/cart.js";
import { CartProducts, CartSidebar, EmptyCart } from "./CartComponents";

const cartStore = useCartStore();
const { cart } = storeToRefs(cartStore);

const cartHasItems = computed(() => {
  return cart.value.items && cart.value.items.length > 0;
});

const cartIsEmpty = computed(() => {
  return cart.value.items?.length == 0 && cart.value.item_count == 0;
});

const cartReady = computed(() => Object.keys(cart).length > 0);

defineProps({
  settings: {
    type: Object,
    default: () => {},
  },
  emptyCartSettings: {
    type: Object,
    default: () => {},
  },
});
</script>

<style scoped>
.cart-enter-active,
.cart-leave-active {
  transition: opacity 0.5s ease;
}

.cart-enter-from,
.cart-leave-to {
  opacity: 0;
}
</style>
