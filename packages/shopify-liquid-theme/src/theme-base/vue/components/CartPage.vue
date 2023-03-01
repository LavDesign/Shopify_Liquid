<template>
  <div
    v-if="cart?.items?.length > 0"
    class="w-full p-5 flex flex-col md:flex-row justify-around bg-tertiary-500"
  >
    <div class="basis-5/12">
      <h3 class="mb-6">{{ settings.cart_header_text }}</h3>
      <CartProducts :cart="cart" />
    </div>
    <CartSidebar :cart="cart" :settings="settings" />
  </div>

  <div
    v-else
    class="text-center mt-4 flex flex-col items-center pt-[88px] pb-32"
  >
    <EmptyCart :settings="emptyCartSettings" />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useCartStore } from "../stores/cart";
import CartProducts from "./CartComponents/CartProducts.vue";
import CartSidebar from "./CartComponents/CartSidebar.vue";
import EmptyCart from "./CartComponents/EmptyCart.vue";

const cartStore = useCartStore();
const { cart } = storeToRefs(cartStore);

const props = defineProps({
  settings: {
    type: Object,
    default: () => {},
  },
  emptyCartSettings: {
    type: Object,
    default: () => {},
  },
});

const settings = ref(props.settings);
const emptyCartSettings = ref(props.emptyCartSettings);
</script>
