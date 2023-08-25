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
import { cartToggle } from "../../js/utils/cart-actions.js";

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
  updateGallery(true);
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
    .then((data) => {
      const { item_count } = data;
      const event = new CustomEvent("cartUpdated", {
        detail: { item_count: item_count },
      });
      window.dispatchEvent(event);
      dataAddToCart(props.product, currentVariant, qty);
    })
    .then(() => cartToggle());
  isAddingToCart.value = false;
};

const updateVariantURL = () => {
  const searchParamString = new URLSearchParams({
    variant: currentVariant.value.id,
  }).toString();

  searchParamString && updateURL(searchParamString);
};

const thumbnailSwiperInstance = document.querySelector(
  ".product-media-gallery__thumbnails"
)?.swiper;

const primarySwiperInstance = document.querySelector(
  ".product-media-gallery__primary"
)?.swiper;

const lightboxSwiperInstance =
  document.querySelector(".swiper--lightbox")?.swiper;

const slideToCurrentVariantImage = (indexChange) => {
  const currentVariantSlide = primarySwiperInstance?.slides.find(
    (slide) =>
      parseInt(slide.getAttribute("data-media-id")) ===
      currentVariant.value.media.id
  );
  const index =
    parseInt(currentVariantSlide?.getAttribute("data-slide-index")) +
    indexChange;
  window.setTimeout(function () {
    index && primarySwiperInstance.slideTo(index);
  }, 400);
};

const updateGallery = (update = false) => {
  const selectedOptions = currentVariant.value.options;
  if (primarySwiperInstance) {
    const galleryImages = document.querySelectorAll(
      ".ra-gallery-carousel__main [data-options]"
    );
    const thumbnailImages = document.querySelectorAll(
      ".ra-gallery-carousel__thumbnails [data-options]"
    );

    galleryImages.forEach((image) => {
      document.querySelector(".gallery-temp-holder").append(image);
    });

    thumbnailImages.forEach((image) => {
      document.querySelector(".thumbnail-temp-holder").append(image);
    });
    const galleryHolderImages = document.querySelectorAll(
      ".gallery-temp-holder [data-options]"
    );
    const thumbnailHolderImages = document.querySelectorAll(
      ".thumbnail-temp-holder [data-options]"
    );

    let galleryCounter = 1;
    galleryHolderImages.forEach((image) => {
      let imageOptions = image
        .getAttribute("data-options")
        .replaceAll(" ", "")
        .split(",");
      let foundMatch = false;
      for (let i = 0; i < selectedOptions.length; i++) {
        for (let j = 0; j < imageOptions.length; j++) {
          if (
            imageOptions[j].toLowerCase() === selectedOptions[i]?.toLowerCase()
          ) {
            foundMatch = true;
          }
        }
      }
      if (!image.getAttribute("data-alt").includes("|#|")) {
        foundMatch = true;
      }
      if (!foundMatch) {
        document.querySelector(".gallery-temp-holder").append(image);
      } else {
        image.setAttribute("data-slide-index", galleryCounter);
        image.setAttribute("data-swiper-slide-index", galleryCounter);
        document
          .querySelector(".ra-gallery-carousel__main swiper-container")
          .append(image);
        galleryCounter++;
      }
    });

    let thumbnailCounter = 1;
    thumbnailHolderImages.forEach((image) => {
      let imageOptions = image
        .getAttribute("data-options")
        .replaceAll(" ", "")
        .split(",");
      let foundMatch = false;
      for (let i = 0; i < selectedOptions.length; i++) {
        for (let j = 0; j < imageOptions.length; j++) {
          if (
            imageOptions[j].toLowerCase() === selectedOptions[i]?.toLowerCase()
          ) {
            foundMatch = true;
          }
        }
      }
      if (!image.getAttribute("data-alt").includes("|#|")) {
        foundMatch = true;
      }
      if (!foundMatch) {
        document.querySelector(".thumbnail-temp-holder").append(image);
      } else {
        image.setAttribute("data-slide-index", thumbnailCounter);
        image.setAttribute("data-swiper-slide-index", thumbnailCounter);
        document
          .querySelector(".ra-gallery-carousel__thumbnails swiper-container")
          .append(image);
        thumbnailCounter++;
      }
    });
    primarySwiperInstance.update();
    thumbnailSwiperInstance.update();
    lightboxSwiperInstance.update();
  } else {
    const galleryImages = document.querySelectorAll(
      ".scrolling .ra-gallery-carousel__main [data-options]"
    );
    galleryImages.forEach((image) => {
      document.querySelector(".gallery-temp-holder").prepend(image);
    });
    const galleryHolderImages = document.querySelectorAll(
      ".gallery-temp-holder [data-options]"
    );

    galleryHolderImages.forEach((image) => {
      let imageOptions = image
        .getAttribute("data-options")
        .replaceAll(" ", "")
        .split(",");
      let foundMatch = false;
      for (let i = 0; i < selectedOptions.length; i++) {
        for (let j = 0; j < imageOptions.length; j++) {
          if (
            imageOptions[j].toLowerCase() === selectedOptions[i].toLowerCase()
          ) {
            foundMatch = true;
          }
        }
      }
      if (!image.getAttribute("data-alt").includes("|#|")) {
        foundMatch = true;
      }
      if (!foundMatch) {
        if (update) {
          document.querySelector(".gallery-temp-holder").append(image);
        } else {
          document.querySelector(".gallery-temp-holder").prepend(image);
        }
      } else {
        if (update) {
          document
            .querySelector(
              ".scrolling .ra-gallery-carousel__main .product-media-gallery__primary"
            )
            .append(image);
        } else {
          document
            .querySelector(
              ".scrolling .ra-gallery-carousel__main .product-media-gallery__primary"
            )
            .prepend(image);
        }
      }
    });
  }

  const lightboxImages = document.querySelectorAll(
    ".ra-gallery-carousel__lightbox [data-options]"
  );

  lightboxImages.forEach((image) => {
    document.querySelector(".lightbox-temp-holder").append(image);
  });

  const lightboxHolderImages = document.querySelectorAll(
    ".lightbox-temp-holder [data-options]"
  );

  let lightboxCounter = 1;
  lightboxHolderImages.forEach((image) => {
    let imageOptions = image
      .getAttribute("data-options")
      .replaceAll(" ", "")
      .split(",");
    let foundMatch = false;
    for (let i = 0; i < selectedOptions.length; i++) {
      for (let j = 0; j < imageOptions.length; j++) {
        if (
          imageOptions[j].toLowerCase() === selectedOptions[i]?.toLowerCase()
        ) {
          foundMatch = true;
        }
      }
    }
    if (!image.getAttribute("data-alt").includes("|#|")) {
      foundMatch = true;
    }
    if (!foundMatch) {
      document.querySelector(".lightbox-temp-holder").append(image);
    } else {
      image.setAttribute("data-slide-index", lightboxCounter);
      image.setAttribute("data-swiper-slide-index", lightboxCounter);
      document
        .querySelector(".ra-gallery-carousel__lightbox swiper-container")
        .append(image);
      lightboxCounter++;
    }
  });
  lightboxSwiperInstance.update();
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
  const indexChange = -1;
  productStore.setCurrentVariant(variant);
  updateVariantURL();
  slideToCurrentVariantImage(indexChange);
  updateBadgeText();
});

onMounted(() => {
  const indexChange = 0;
  productStore.setCurrentVariant(
    currentVariant.value || props.product.first_available_variant
  );
  slideToCurrentVariantImage(indexChange);
  updateBadgeText();
  updateGallery();

  const disabledSwatches = document.querySelectorAll(".ra-swatch--disabled");
  disabledSwatches.forEach((swatch) => {
    swatch.removeAttribute("disabled");
  });
});
</script>
