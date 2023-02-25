<template>
  <div
    class="w-full flex flex-row gap-[16px] font-primary py-[16px] border-y border-grey-200"
    :class="{
      'border-y border-grey-200': tileType === 'cart',
      'border border-grey-500 px-[16px]': tileType === 'upsell',
    }"
  >
    <a :href="product_link" class="aspect-square max-w-[107px]">
      <img
        :src="product_image.src"
        :alt="product_image.alt"
        class="object-cover w-full h-full"
      />
    </a>
    <div class="flex flex-col gap-[4px] justify-between flex-1">
      <a
        :href="product_link"
        :class="{
          'text-base': !isUpsell,
          'text-lg': isUpsell,
        }"
      >
        {{ product_title }}
      </a>
      <div v-if="!isUpsell">
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
      <div v-else>
        <template
          v-for="(variant, i) in product.variants"
          :key="variant.option1 + '_' + i"
        >
          {{ variant.option1 }} - {{ i }} <br />
        </template>
      </div>
      <QuantityAdjuster
        v-if="!isUpsell"
        class="mt-[4px]"
        @quantity-updated="updateQuantity"
        :quantity="product.quantity"
      />
    </div>
    <div class="flex flex-col justify-between">
      <span
        v-if="!isUpsell"
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
        {{ $filters.money(product_price) }}
        <s v-if="product_compare_price != product_price">{{
          $filters.money(product_compare_price)
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

const product = computed(() => props.product);

const isUpsell = props.tileType === "upsell";

const product_handle = computed(() => {
  return product.value.handle;
});

const product_image = computed(() => {
  const image = {};
  image.src =
    product.value.featured_image?.url || product.value.featured_image || "";
  image.alt = product.value.featured_image?.alt || product.value.title || "";
  return image;
});

const product_title = computed(() => {
  return product.value.product_title || product.value.title || "";
});

const product_price = computed(() => {
  return product.value.final_line_price || product.value.price;
});

const product_compare_price = computed(() => {
  return product.value.original_line_price || product.value.compare_at_price;
});

const product_link = computed(() => {
  return product.value?.url || `/products/${product_handle.value}`;
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
