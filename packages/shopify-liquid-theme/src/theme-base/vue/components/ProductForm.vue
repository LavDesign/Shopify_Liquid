<template>
  <div class="ra-product-form">
    <div v-if="!product.has_only_default_variant" class="mb-16">
      <template v-for="(options, optionKey) in formattedOptions">
        <SwatchPicker
          v-if="optionsAsSwatches.includes(optionKey)"
          :key="`swatch_${optionKey}`"
          :label="optionKey"
          :options="options"
          :selected="selectedOptions[optionKey]"
          @change:option="
            (selected, option) =>
              handleOptionSelect(optionKey, selected, option)
          "
        />

        <OptionPicker
          v-else
          :key="`option_${optionKey}`"
          :label="optionKey"
          :options="options"
          :selected="selectedOptions[optionKey]"
          :variant="getOptionVariant(optionKey)"
          :itemsPerRow="getItemsPerRow(optionKey)"
          :size="getOptionSizes(optionKey)"
          :fillSpace="false"
          @change:option="
            (selected, option) =>
              handleOptionSelect(optionKey, selected, option)
          "
        />
      </template>
    </div>

    <RaAddToCart
      v-bind="{ buttonLabel, qty }"
      @input="(value) => (qty = value)"
      @click="addToCart"
      :buttonProps="{ disabled: !currentVariant.available }"
    />
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, watch } from "vue";
import { useCartStore } from "../stores/cart.js";
import { useProductPageStore } from "../stores/productPage";
import { updateURL } from "../../js/utils/search-params.js";
import { RaAddToCart } from "@bva/ui-vue";
import SwatchPicker from "./SwatchPicker.vue";
import OptionPicker from "./OptionPicker.vue";
import { dataViewItem, dataAddToCart } from "./datalayer/";

const props = defineProps({
  product: Object,
});

const cartStore = useCartStore();

// ToDo: Add these values as a prop to pull from customizer
const optionsAsDropdowns = [];
const optionsAsSwatches =
  window.global_settings.settings.swatch_options.split(",");
const optionsAsSmall = ["Size"];
const optionsAsHorizontal = ["Material"];

const itemsPerRow = {
  xs: 2,
  sm: 4,
};

const itemsPerRowSmall = {
  sm: 6,
  lg: 8,
};

function getItemsPerRow(optionName) {
  return optionsAsSmall.includes(optionName) ? itemsPerRowSmall : itemsPerRow;
}

function isHorizontalOption(optionName) {
  return optionsAsHorizontal.includes(optionName);
}

function getOptionVariant(optionName) {
  return optionsAsDropdowns.includes(optionName) ? "dropdown" : "grid";
}

function getOptionSizes(optionName) {
  if (isHorizontalOption(optionName)) {
    return {
      height: "var(--option-picker-horizontal-height)",
      width: "120px",
    };
  } else {
    return {
      width: "var(--option-picker-square-height)",
      height: "var(--option-picker-square-height)",
    };
  }
}

const optionsWithValues = reactive(props.product.options_with_values);

// Set initial options from first_available_variant
const selectedOptions = reactive({});

// Note: Insertion order should be preserved here as of ES2015 (assuming string keys),
// but there could be edge cases where options might not be properly ordered if using an int as a key
props.product?.options?.forEach((option, i) => {
  selectedOptions[option] = props.product.first_available_variant.options[i];
});

const handleOptionSelect = (optionKey, selected, selectedOption) => {
  selectedOptions[optionKey] = selectedOption.value;
  dataViewItem(props.product, currentVariant);
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
      return (
        variant.options[optionKeyIndices[0]] ===
          currentVariant.value.options[optionKeyIndices[0]] &&
        variant.options[optionKeyIndices[1]] ===
          currentVariant.value.options[optionKeyIndices[1]] &&
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
    // Todo - Find a more elegant way of passing separate data for swatches

    // Currently the liquid templates don't have insight into which option keys are set to use
    // color swatches, so there's some necessary config duplication until
    // we switch to the storefront API
    if (optionsAsSwatches.includes(option)) {
      optionsWithValues[option].forEach((optionValue) => {
        const optionIsAvailable = optionHasInStockVariant(
          optionValue.value,
          optionIndex
        );
        formattedOptions[option].push({
          label: optionValue.value,
          value: optionValue.value,
          image: optionValue.url,
          disabled: !optionIsAvailable,
        });
      });
    } else {
      optionsWithValues[option].forEach((value) => {
        const optionIsAvailable = optionHasInStockVariant(value, optionIndex);
        formattedOptions[option].push({
          label: value,
          value,
          disabled: !optionIsAvailable,
        });
      });
    }
  });

  return formattedOptions;
});

const hasComplexVariants = computed(() => {
  return props.product ? props.product.options.length > 1 : false;
});

const currentVariant = computed(() => {
  let currentVariant = props.product.variants[0];
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

const qty = ref(1);
const isAddingToCart = ref(false);

const addToCart = async () => {
  isAddingToCart.value = true;
  await cartStore
    .addItem({
      id: currentVariant.value.id,
      quantity: qty.value,
      // properties: null
    })
    .then(() => dataAddToCart(props.product, currentVariant, qty))
    .then(() => window.dispatchEvent(new Event("toggleCart")));
  isAddingToCart.value = false;
};

const updateVariantURL = () => {
  const searchParamString = new URLSearchParams({
    variant: currentVariant.value.id,
  }).toString();

  searchParamString && updateURL(searchParamString);
};

const primarySwiperInstance = document.querySelector(
  ".product-media-gallery__primary"
)?.swiper;

const slideToCurrentVariantImage = () => {
  const currentVariantSlide = primarySwiperInstance?.slides.find(
    (slide) =>
      parseInt(slide.getAttribute("data-media-id")) ===
      currentVariant.value.media.id
  );
  const index = currentVariantSlide?.getAttribute("data-slide-index");
  index && primarySwiperInstance.slideTo(index);
};

const updateBadgeText = () => {
  let badgeText;
  let badgeOverride = false;
  let timeDifference;
  const { back_in_stock } = currentVariant.value;
  if (currentVariant.value.badge) {
    badgeText = currentVariant.value.badge;
    badgeOverride = currentVariant.value.badge_override;
  } else if (props.product.badge) {
    badgeText = props.product.badge;
    badgeOverride = props.product.badge_override;
  }
  if (!badgeOverride) {
    if (
      currentVariant.value.inventory_quantity === 0 &&
      currentVariant.value.inventory_policy === "deny"
    ) {
      badgeText = "Sold Out";
    } else if (back_in_stock) {
      const year = back_in_stock.split("-")[0];
      const month = back_in_stock.split("-")[1];
      const day = back_in_stock.split("-")[2];
      const bisDate = new Date(`${month}/${day}/${year}`);
      const currentDate = Date.now();
      timeDifference = (currentDate - bisDate) / (1000 * 3600 * 24);
      if (timeDifference < 14) {
        badgeText = "Back in Stock";
      }
    } else if (
      currentVariant.value.price < currentVariant.value.compare_at_price
    ) {
      badgeText = "On Sale";
    }
  }
  if (badgeText && productBadge) {
    productBadge.textContent = badgeText;
    productBadge.classList.remove("hidden");
  } else {
    productBadge?.classList.add("hidden");
  }
};

const productBadge = document.querySelector("[data-pdp-badge]");

const productStore = useProductPageStore();

watch(currentVariant, (variant) => {
  productStore.setCurrentVariant(variant);
  updateVariantURL();
  slideToCurrentVariantImage();
  updateBadgeText();
});

onMounted(() => {
  productStore.setCurrentVariant(
    currentVariant.value || props.product.first_available_variant
  );
  slideToCurrentVariantImage();
  updateBadgeText();
});
</script>
