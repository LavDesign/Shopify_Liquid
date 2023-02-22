<template>
  <div v-if="cart" class="w-full p-5 flex flex-row justify-around">
    <div class="basis-5/12">
      <h3 class="mb-[24px]">Cart</h3>
      <CartProducts :cart="cart" />
    </div>
    <CartSidebar :cart="cart" />
  </div>
  <div v-else>loading...</div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useCartStore } from "../stores/cart";
import CartProducts from "./CartComponents/CartProducts.vue";
import CartSidebar from "./CartComponents/CartSidebar.vue";

const cartStore = useCartStore();
const { cart } = storeToRefs(cartStore);

onMounted(() => {
  cartStore.load();
});
</script>
