<template>
  <div class="w-full pb-10 flex items-center justify-between flex-col">
    <Transition name="fade">
      <div
        v-if="cartOpen && cartReady"
        @click="toggleCart"
        @scroll.prevent
        class="fixed z-[998] !block inset-0 bg-grey-900 opacity-[0.65]"
      ></div>
    </Transition>
    <Transition name="sidecart">
      <div
        v-if="cartOpen"
        class="w-full sm:max-w-[470px] fixed max-h-screen h-full top-0 right-0 z-[999] bg-tertiary-500 flex flex-col"
        ref="cartInline"
      >
        <div class="w-full">
          <div class="px-4 py-3 bg-tertiary-900 flex flex-row justify-between">
            <span class="text-lg text-white text-bold" v-text="cartCount" />
            <button @click="toggleCart">
              <svg class="ra-icon text-white h-4 w-4 cursor-pointer">
                <use xlink:href="#close"></use>
              </svg>
            </button>
          </div>
          <div class="px-6 pt-4 pb-2 bg-white">
            <CartProgressBar
              v-if="settings.free_gift_enabled"
              :threshold="settings.free_gift_threshold"
              :subtotal="cart.total_price"
            />
          </div>
        </div>
        <div
          class="px-6 pt-8 pb-5 overflow-y-scroll"
          id="inline_cart_container"
        >
          <template v-if="cartHasItems">
            <div class="mb-2">
              <CartProducts :cart="cart" />
            </div>
            <CartGiftMessage
              v-if="settings.gift_message_enabled"
              :message="settings.gift_message_text"
            />
            <CartMessage
              v-if="settings.cart_message_1?.length > 0"
              :message="settings.cart_message_1"
              :color="settings.cart_message_1_color"
            />
            <div class="pt-3 md:pt-8">
              <CartUpsell
                v-if="settings.upsell_enabled && settings.upsell_product"
                :product="settings.upsell_product"
              />
            </div>
          </template>
          <template v-else-if="cartIsEmpty">
            <div class="flex flex-col items-center pt-8 md:pt-15">
              <EmptyCart :settings="emptyCartSettings" />
            </div>
          </template>
        </div>
        <div class="px-6 pb-4 mt-auto">
          <CartSubtotal :subtotal="cart.total_price" />
          <CartCheckoutButton :checkout-ready="cartHasItems" />
          <CartMessage
            v-if="settings.cart_message_2?.length > 0"
            :message="settings.cart_message_2"
            :color="settings.cart_message_2_color"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useCartStore } from "../stores/cart";
import {
  CartProducts,
  EmptyCart,
  CartGiftMessage,
  CartMessage,
  CartCheckoutButton,
  CartProgressBar,
  CartUpsell,
  CartSubtotal,
} from "./CartComponents";

const cartStore = useCartStore();

const { cart } = storeToRefs(cartStore);

const cartHasItems = computed(
  () => cart.value.items && cart.value.items.length > 0
);

const cartIsEmpty = computed(
  () => cart.value.items?.length == 0 && cart.value.item_count == 0
);

const cartReady = computed(() => Object.keys(cart).length > 0);

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

const cartCount = computed(() => {
  const { cart_header_text } = settings.value;
  const { item_count } = cart.value;
  const cart_count_text = `(${item_count} Item${item_count > 1 ? "s" : ""})`;
  return `${cart_header_text} ${item_count > 0 ? cart_count_text : ""}`;
});

const cartOpen = ref(false);

const toggleCart = () => {
  const body = document.getElementsByTagName("body");
  cartOpen.value = !cartOpen.value;
  if (cartOpen.value) {
    body[0].classList.add("modal-open");
  } else body[0].classList.remove("modal-open");
};

const headerToggle = document.querySelector("[data-cart-toggle]");

const keyboardHandler = (event) => {
  if (event.key == "Escape" || event.code == "Escape") toggleCart();
  else if (event.key == "Tab" || event.code == "Tab") focusTrap(event);
  event.handled = true;
};

onMounted(() => {
  window.addEventListener("toggleCart", toggleCart);
});

const cartInline = ref();
const focusableElements = ref();

watch(cartOpen, () => {
  if (cartOpen.value) {
    nextTick(() => {
      window.addEventListener("keydown", keyboardHandler);
      focusableElements.value = getFocusableElements(cartInline.value);
      focusableElements.value[0].focus();
    });
  } else {
    window.removeEventListener("keydown", keyboardHandler);
    headerToggle.focus();
  }
});

const focusTrap = (event) => {
  const firstEl = focusableElements.value[0];
  const currentEl = document.activeElement;
  const lastEl = focusableElements.value[focusableElements.value.length - 1];
  if (currentEl === lastEl) {
    event.preventDefault();
    firstEl.focus();
  } else if (currentEl === firstEl && event.shiftKey) {
    event.preventDefault();
    lastEl.focus();
  }
};

const getFocusableElements = (container) => {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
};
</script>

<style scoped>
.sidecart-enter-active,
.sidecart-leave-active {
  transition: margin 0.5s ease;
}

.sidecart-enter-from,
.sidecart-leave-to {
  margin-right: -470px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
}

#inline_cart_container::-webkit-scrollbar {
  display: none;
}
</style>
