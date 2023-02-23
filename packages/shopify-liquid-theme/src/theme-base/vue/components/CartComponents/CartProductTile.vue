<template>
  <div
    class="w-full flex flex-row gap-[16px] font-primary py-[16px] border-y border-grey-200"
    :class="{
      'border-y border-grey-200': tileType === 'cart',
      'border border-grey-500': tileType === 'upsell',
    }"
  >
    <div class="aspect-square object-cover">
      <img
        :src="product.featured_image.url"
        :alt="product.featured_image.alt"
        class="max-w-[107px] w-full"
      />
    </div>
    <div class="flex flex-col gap-[4px] justify-between flex-1">
      <span class="text-base">
        {{ product.product_title }}
      </span>
      <div v-if="product.options_with_values">
        <div
          v-for="(option, i) in product.options_with_values"
          :key="product.handle + '-' + i"
          class="flex-col text-sm font-light"
        >
          {{ option.name }} <br /><span class="text-grey-500">{{
            option.value
          }}</span>
        </div>
      </div>
      <QuantityAdjuster
        class="mt-[4px]"
        @quantity-updated="updateQuantity"
        :quantity="product.quantity"
      />
    </div>
    <div class="flex flex-col justify-between">
      <span
        class="border border-grey-900 w-[34px] h-[34px] flex items-center justify-center self-end cursor-pointer"
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
        {{ $filters.money(product.final_line_price) }}
        <s v-if="product.original_line_price != product.final_line_price">{{
          $filters.money(product.original_line_price)
        }}</s>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCartStore } from "../../stores/cart";
import QuantityAdjuster from "../QuantityAdjuster.vue";

const cartStore = useCartStore();

const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
  tileType: {
    type: String,
    default: "cart",
  },
});

const product = computed(() => {
  return props.product;
});

const updateQuantity = (qty) => {
  const productObj = {
    id: product.value.id.toString(),
    quantity: qty.toString(),
    properties: product.value.properties,
  };
  cartStore.updateItem(productObj);
};
</script>
