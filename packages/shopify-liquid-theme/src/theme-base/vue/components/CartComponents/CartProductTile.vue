<template>
  <div class="w-full flex flex-col border-y border-grey-200 font-primary py-4">
    <div class="w-full flex flex-row gap-4">
      <a :href="product_link" class="aspect-square max-w-[107px]">
        <img
          :src="product_image.url"
          :alt="product_image.alt"
          class="object-cover w-full h-full"
        />
      </a>
      <div class="flex flex-col gap-1 justify-between flex-1">
        <a :href="product_link" class="text-base">
          {{ product_title }}
        </a>
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
          class="ra-button ra-icon-button ra-button--tertiary ra-icon-button--md"
          @click="updateQuantity(0)"
        >
          <svg
            width="12"
            height="16"
            viewBox="0 0 12 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 16L1 16L1 4L11 4L11 16Z" fill="#534D4D" />
            <path d="M9 1L12 1V3L0 3L0 1L3 1L4 0L8 0L9 1Z" fill="#534D4D" />
          </svg>
        </span>
        <div class="flex-row text-lg">
          {{ $filters.money(product_price) }}
          <s v-if="product_compare_price != product_price">{{
            $filters.money(product_compare_price)
          }}</s>
        </div>
      </div>
    </div>
    <div v-if="isSubscriptionProduct" class="border border-grey-400 p-3 mt-4">
      <div
        class="ra-choice ra-choice--radio ra-choice--classic ra-choice--radio-classic"
      >
        <input
          :id="product_handle + '-' + product.id"
          type="radio"
          class="ra-choice__input"
        />
        <label
          :for="product_handle + '-' + product.id"
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
import { useCartStore } from "../../stores/cart";
import QuantityAdjuster from "../QuantityAdjuster.vue";

const cartStore = useCartStore();
const isSubscriptionProduct = false;

const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
});

const product = computed(() => props.product);

const product_handle = computed(() => product.value.handle);

const product_image = computed(() => product.value.featured_image);

const product_title = computed(() => product.value?.product_title);

const product_price = computed(() => product.value.final_line_price);

const product_compare_price = computed(() => product.value.original_line_price);

const product_link = computed(() => product.value?.url);

const updateQuantity = (qty) => {
  const productObj = {
    id: product.value.id.toString(),
    quantity: qty.toString(),
    properties: product.value.properties,
  };
  cartStore.updateItem(productObj);
};
</script>
