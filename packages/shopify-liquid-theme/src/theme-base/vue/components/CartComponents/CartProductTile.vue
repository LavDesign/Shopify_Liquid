<template>
  <div class="w-full flex flex-col border-y border-grey-200 font-primary py-4">
    <div class="w-full flex flex-row gap-4">
      <a :href="product.url" class="!block w-full max-w-[112px]">
        <img v-bind="product_image" class="w-full aspect-square object-cover" />
      </a>
      <div class="flex flex-col gap-1 justify-between flex-1">
        <a
          :href="product.url"
          class="text-base"
          v-text="product.product_title"
        />
        <div>
          <div
            v-for="(option, i) in product.options_with_values"
            :key="product.handle + '-' + i"
            class="flex-col text-sm font-light"
            :class="{
              'mt-1': i != 0,
            }"
          >
            {{ option.name }} <br /><span class="text-grey-500">{{
              option.value
            }}</span>
          </div>
        </div>
        <QuantityAdjuster
          class="mt-1"
          @quantity-updated="updateQuantity"
          :quantity="product.quantity"
        />
      </div>
      <div class="flex flex-col justify-between items-end">
        <span
          class="ra-button ra-icon-button ra-button--tertiary ra-icon-button--md group"
          @click="updateQuantity(0)"
        >
          <svg
            width="12"
            height="16"
            viewBox="0 0 12 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="group-hover:fill-white fill-tertiary-900 transition-all"
          >
            <path d="M11 16L1 16L1 4L11 4L11 16Z" />
            <path d="M9 1L12 1V3L0 3L0 1L3 1L4 0L8 0L9 1Z" />
          </svg>
        </span>
        <div class="flex-row text-lg">
          {{ $filters.money(product.final_line_price) }}
          <s v-if="product.original_line_price != product.final_line_price">{{
            $filters.money(product.original_line_price)
          }}</s>
        </div>
      </div>
    </div>
    <div v-if="isSubscriptionProduct" class="border border-grey-400 p-3 mt-4">
      <div
        class="ra-choice ra-choice--radio ra-choice--classic ra-choice--radio-classic"
      >
        <input
          :id="product.handle + '-' + product.id"
          type="radio"
          class="ra-choice__input"
        />
        <label
          :for="product.handle + '-' + product.id"
          class="ra-choice__label-container ra-choice__container set--sibling-deep-focus"
        >
          <div class="ra-choice__checkmark set--inherit-focus">
            <span class="ra-choice__checkmark-icon"></span>
          </div>
          <span class="ra-choice__label">Subscribe & Save 15%</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCartStore } from "../../stores/cart.js";
import { getSizedImageFromUrl } from "../../filters/image.js";
import QuantityAdjuster from "../QuantityAdjuster.vue";
import { dataRemoveFromCart } from "../datalayer/";

const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
});

const cartStore = useCartStore();

const product_image = computed(() => {
  const img = {};
  img.src = small_image.value;
  img.alt = props.product.featured_image.alt;
  return img;
});

const small_image = computed(() =>
  getSizedImageFromUrl(props.product.featured_image.url, "small")
);

const updateQuantity = (qty) => {
  const productObj = {
    id: props.product.id.toString(),
    quantity: qty.toString(),
    properties: props.product.properties,
  };
  if (qty < props.product.quantity) dataRemoveFromCart(props.product);
  cartStore.updateItem(productObj).then((cart) => {
    const event = new CustomEvent("cartUpdated", {
      detail: { item_count: cart.item_count },
    });
    window.dispatchEvent(event);
  })
};

const isSubscriptionProduct = false;
</script>
