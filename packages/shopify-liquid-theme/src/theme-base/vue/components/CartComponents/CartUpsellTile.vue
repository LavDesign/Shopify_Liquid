<template>
  <div class="flex w-full flex-col p-4 border border-grey-500 upsell-tile">
    <div class="w-full flex flex-row gap-4 font-primary">
      <a :href="product_link" class="!block w-full max-w-[112px]">
        <img
          v-bind="product_image"
          class="w-full h-full aspect-square object-cover"
        />
      </a>
      <div class="flex flex-col gap-1 justify-between flex-1">
        <div class="flex flex-row justify-between gap-2">
          <a :href="product_link" class="text-lg" v-text="product.title" />
          <div
            class="flex-row text-lg text-right"
            :class="{
              'text-red':
                product_compare_price && product_compare_price != product_price,
            }"
          >
            {{ $filters.money(product_price) }}
            <s
              v-if="
                product_compare_price && product_compare_price != product_price
              "
              class="text-grey-500"
              >{{ $filters.money(product_compare_price) }}</s
            >
          </div>
        </div>
        <div class="gap-2 flex flex-col" v-if="hasVariants">
          <template v-for="(options, optionKey) in formattedOptions">
            <CartSwatchPicker
              v-if="swatchOptions.includes(optionKey)"
              :key="`swatch_${optionKey}`"
              label=""
              :options="options"
              :selected="
                selectedOptions[optionKey]
                  ? selectedOptions[optionKey]
                  : options[0].value
              "
              @change:option="
                (selected, option) =>
                  handleOptionSelect(optionKey, selected, option)
              "
            />

            <CartOptionPicker
              v-else
              label=""
              :key="`${optionKey}`"
              :options="options"
              :selected="
                selectedOptions[optionKey]
                  ? selectedOptions[optionKey]
                  : options[0].value
              "
              variant="dropdown"
              :itemsPerRow="itemsPerRow"
              class="-mb-1"
              @change:option="
                (selected, option) =>
                  handleOptionSelect(optionKey, selected, option)
              "
            />
          </template>
        </div>
      </div>
    </div>
    <div v-if="displayCta">
      <button
        class="ra-button ra-button--full-width ra-button--sm mt-2"
        @click="addToCart"
        v-text="buttonLabel"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch, ref, onMounted } from "vue";
import { useCartStore } from "../../stores/cart.js";
import { useProductPageStore } from "../../stores/productPage.js";
import { getSizedImageFromUrl } from "../../filters/image.js";
import { CartSwatchPicker, CartOptionPicker } from "./";

const cartStore = useCartStore();

const props = defineProps({
  product: {
    type: Object,
  },
});

const product_image = computed(() => {
  const image = {};
  if (variantSelected.value && currentVariant.value.image?.default?.sizes?.sm) {
    image.src = currentVariant.value.image.default?.sizes.sm;
    image.alt = currentVariant.value.image.default?.alt;
  } else {
    image.src = small_product_image.value;
    image.alt = props.product.title;
  }
  return image;
});

const small_product_image = computed(() =>
  getSizedImageFromUrl(props.product.featured_image, "small")
);

const product_price = computed(() => {
  return variantSelected.value
    ? currentVariant.value.price
    : props.product.price;
});

const product_compare_price = computed(() => {
  return variantSelected.value ? currentVariant.value.compare_at_price : null;
});

const product_link = computed(() => {
  return variantSelected.value
    ? currentVariant.value.url
    : `/products/${props.product.handle}`;
});

const hasVariants = computed(() => props.product?.variants?.length > 1);

const swatchOptions = window.global_settings.settings.swatch_options.split(",");

const displayCta = computed(() => {
  return hasVariants.value
    ? optionsSelected.value.length === variantOptions.value
    : true;
});
const variantSelected = ref(false);

// const swatchOptions = ["Color"];

const itemsPerRow = "3";

const optionsWithValues = reactive(props.product.options_with_values);

// Set initial options from first_available_variant
const selectedOptions = reactive({});

const handleOptionSelect = (optionKey, selected, selectedOption) => {
  if (!optionsSelected.value.includes(optionKey)) {
    // optionsSelected.value.push(optionKey);
  }
  selectedOptions[optionKey] = selectedOption.value;
};

const optionHasInStockVariant = (optionValue, optionKeyIndex) => {
  // Get indices of variant option keys not currently selected
  const variants = props.product.variants;
  const optionKeyIndices = [0, 1, 2];
  const currentOptionIndex = optionKeyIndices.splice(optionKeyIndex, 1)[0];

  // Find the variant that matches the optionValue passed in along with the currentvariant's remaining selected options,
  // check availability and return a Boolean
  const filteredAvailableVariants = variants
    .filter((variant) => {
      const options = variant.options.filter((option) => option);
      const currentVariantOptions = currentVariant.value.options.filter(
        (option) => option
      );
      return (
        options[optionKeyIndices[0]] ===
          currentVariantOptions[optionKeyIndices[0]] &&
        options[optionKeyIndices[1]] ===
          currentVariantOptions[optionKeyIndices[1]] &&
        variant.available
      );
    })
    .some((variant) => variant.options[currentOptionIndex] === optionValue);
  return filteredAvailableVariants;
};
// Set keyed object for all option values and disabled state
const formattedOptions = computed(() => {
  const formattedOptions = {};

  props.product.options.forEach((option, optionIndex) => {
    formattedOptions[option] = [];
    let optionIsAvailable = null;

    optionsWithValues[option].forEach((value) => {
      if (swatchOptions.includes(option)) {
        optionIsAvailable = optionHasInStockVariant(value.value, optionIndex);
        formattedOptions[option].push({
          label: value.value,
          color: value.value.toLowerCase(),
          value: value.value,
          disabled: !optionIsAvailable,
        });
      } else {
        optionIsAvailable = optionHasInStockVariant(value, optionIndex);
        formattedOptions[option].push({
          label: value,
          value,
          disabled: !optionIsAvailable,
        });
      }
    });
  });

  return formattedOptions;
});

const hasComplexVariants = computed(() => {
  return props.product ? props.product.options?.length > 1 : false;
});

const currentVariant = computed(() => {
  let currentVariant = props.product?.variants?.[0];
  if (hasComplexVariants.value) {
    if (props.product.options.length > 2) {
      currentVariant = props.product.variants.find(
        (variant) =>
          variant.option1 === Object.values(selectedOptions)[0] &&
          variant.option2 === Object.values(selectedOptions)[1] &&
          variant.option3 === Object.values(selectedOptions)[2]
      );
    } else {
      currentVariant = props.product.variants.find(
        (variant) =>
          variant.option1 === Object.values(selectedOptions)[0] &&
          variant.option2 === Object.values(selectedOptions)[1]
      );
    }
  } else if (props.product.variants_count > 1) {
    currentVariant = props.product.variants.find(
      (variant) => variant.option1 === Object.values(selectedOptions)[0]
    );
  }
  return currentVariant || props.product.first_available_variant;
});

const buttonLabel = computed(() => {
  return isAddingToCart.value ? "Adding..." : "Add to Cart";
});

const productStore = useProductPageStore();
const isAddingToCart = ref(false);
const addToCart = async () => {
  isAddingToCart.value = true;
  await cartStore.addItem({ id: currentVariant.value.id, quantity: 1 });
  isAddingToCart.value = false;
};

const variantOptions = computed(() => props.product.options.length);
const optionsSelected = ref([]);

watch(currentVariant, (variant) => {
  variantSelected.value = true;
  productStore.setCurrentVariant(variant);
});

onMounted(() => {
  variantSelected.value = !hasComplexVariants.value;
  for (let i = 0; i < props.product.options.length; i++) {
    let productOption = props.product.options[i];
    if (props.product.options_with_values[productOption][0].value) {
      selectedOptions[productOption] =
        props.product.options_with_values[productOption][0].value;
      optionsSelected.value.push(selectedOptions[productOption]);
    } else {
      selectedOptions[productOption] =
        props.product.options_with_values[productOption][0];
      optionsSelected.value.push(selectedOptions[productOption]);
    }
  }
});
</script>
