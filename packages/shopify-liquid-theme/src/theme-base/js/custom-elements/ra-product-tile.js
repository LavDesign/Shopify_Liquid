import { money } from "../utils/money";

export default class RaProductTile extends HTMLElement {
  constructor() {
    super();
    // Setting the product and current variant
    this.product = JSON.parse(this.getAttribute("data-product"));
    this.variants = this.product.variants;
    this.currentVariant = this.product.variants.find(
      (variant) => variant.id == this.getAttribute("data-current-variant")
    );
    // Properties that update on Variant Switch
    this.featuredImage = this.querySelector("[data-featured-image]");
    this.altImage = this.querySelector("[data-alt-image]");
    this.price = this.querySelector("[data-price]");
    this.priceCompare = this.querySelector("[data-price-compare]");
    this.productUrl = this.querySelector("[data-product-link]");
    this.productTitle = this.querySelector("[data-variant-title]");
    // Swatch Properties
    this.swatchOverflowStyle = "scroll"; // expecting expand or scroll
    this.optionContainer = this.querySelector("[data-option-container]");
    this.variantOptions = this.querySelector("[data-variant-options]");
    // Determine what the maximum scrollable value is to determine
    // whether or not to display the arrows
    this.maxScrollLeft =
      this.variantOptions?.scrollWidth - this.variantOptions?.clientWidth;
    this.activeFilters;
  }

  connectedCallback() {
    this.activeFilters = this.getActiveFilters();
    if (this.variantOptions?.children?.length > 0) {
      this.maxScrollLeft =
        this.variantOptions.scrollWidth - this.variantOptions.clientWidth;
      this.swatchOverflow();
      this.initTile();
      window.addEventListener("resize", this.handleResize.bind(this));
    }
  }

  initTile() {
    const variants = this.variants;
    const activeFilters = this.activeFilters;
    const availableVariants = [];
    const product = this.product;
    const optionNames = product.options;
    const optionIndex = {};
    optionNames.forEach((option, i) => {
      optionIndex[i + 1] = option;
    });

    Array.from(this.variantOptions.children).forEach((option, i) => {
      const label = option.querySelector("label");
      const input = option.querySelector("input");
      if (Object.keys(activeFilters).length > 0) {
        if (activeFilters[input.name]) {
          activeFilters[input.name].forEach((af) => {
            if (af == input.value) {
              const foundVariant = findVariant(input);
              if (foundVariant) {
                this.setCurrentVariant(foundVariant[0]);
                // label.classList.add("active");
              }
            }
          });
        }
      } else if (i == 0) {
        label.classList.add("active");
      }
      option.addEventListener("click", this.swatchClick.bind(this));
    });

    function findVariant(input) {
      const { name, value } = input;
      const optionPosition = parseInt(input.dataset.optionPosition);
      variants.forEach((variant) => {
        if (
          variant[`option${optionPosition}`] == value ||
          product.options[optionPosition - 1].toLowerCase() == name
        ) {
          availableVariants.push(variant);
        }
      });
      const activeVariants = availableVariants.filter((variant) => {
        const activeFilters = [1, 2, 3]
          .map((i) => {
            if (optionIndex[i]) {
              const option = optionIndex[i].toLowerCase();
              const value = variant[`option${i}`];
              if (activeFilters[option]?.includes(value)) {
                return value;
              } else {
                return null;
              }
            } else {
              return null;
            }
          })
          .filter((el) => el !== undefined && el !== null);
        if (activeFilters.length >= Object.keys(activeFilters).length) {
          return variant;
        }
      });
      return activeVariants;
    }
  }

  getActiveFilters() {
    const { search } = window.location;
    const activeFilters = {};
    const params = search.slice(1).split("&");
    const cleanParams = params
      .map((param) => {
        if (param.includes("filter")) {
          return param.split("filter.v.option.").pop();
        }
        return null;
      })
      .filter((el) => el !== undefined && el !== null);
    cleanParams.forEach((param) => {
      const [key, value] = param.split("=");
      if (!activeFilters[key]) {
        activeFilters[key] = [];
      }
      activeFilters[key].push(value);
    });
    return activeFilters;
  }

  handleResize() {
    const newMaxScrollLeft =
      this.variantOptions.scrollWidth - this.variantOptions.clientWidth;
    if (this.maxScrollLeft != newMaxScrollLeft) {
      this.maxScrollLeft = newMaxScrollLeft;
      if (this.swatchOverflowStyle == "scroll")
        this.displayArrows(this.variantOptions.scrollLeft);
    }
  }

  setCurrentVariant(variant) {
    this.currentVariant = variant;
    this.updateProductUrl();
    this.updateImages();
    this.updatePrice();
    this.updateAttribute();
    this.updateSwatch();
  }

  updateSwatch() {
    Array.from(this.variantOptions.children).forEach((option) => {
      const input = option.querySelector("input");
      const label = option.querySelector("label");
      const { optionValue, optionPosition } = input.dataset;
      if (this.currentVariant[`option${optionPosition}`] == optionValue) {
        label.classList.add("active");
      } else {
        label.classList.remove("active");
      }
    });
  }

  swatchClick(e) {
    const activeOption = e.target;
    const { optionPosition, optionValue } = activeOption.dataset;
    const newOptions = Array.from(this.currentVariant.options);
    newOptions[optionPosition - 1] = optionValue;
    const newVariant = this.product.variants.find((variant) =>
      variant.options.every((value, index) => value === newOptions[index])
    );
    this.setCurrentVariant(newVariant);
  }

  swatchOverflow() {
    // used to set up swatch overflow style
    if (
      this.swatchOverflowStyle == "scroll" &&
      this.variantOptions.children.length > 1
    ) {
      this.buildArrows();
      this.displayArrows();
    } else if (this.swatchOverflowStyle == "expand") {
      this.buildViewMore();
    }
  }

  displayArrows(newScrollValue = 0) {
    const leftScroll = this.querySelector("[data-scroll-left]");
    const rightScroll = this.querySelector("[data-scroll-right]");
    if (this.variantOptions.clientWidth < this.variantOptions.scrollWidth) {
      this.optionContainer.classList.add("px-4");
      this.maxScrollLeft =
        this.variantOptions.scrollWidth - this.variantOptions.clientWidth;
      if (newScrollValue <= 0) {
        leftScroll.classList.add("hidden");
      } else {
        leftScroll.classList.remove("hidden");
      }
      if (newScrollValue >= this.maxScrollLeft) {
        rightScroll.classList.add("hidden");
      } else {
        rightScroll.classList.remove("hidden");
      }
    } else {
      this.optionContainer.classList.remove("px-4");
      this.maxScrollLeft =
        this.variantOptions.scrollWidth - this.variantOptions.clientWidth;
      leftScroll.classList.add("hidden");
      rightScroll.classList.add("hidden");
    }
  }

  buildViewMore() {
    const viewMore = document.createElement("div");
    viewMore.textContent = "+X more";
    viewMore.classList.add("product-tile__view-more");
    viewMore.setAttribute("data-view-more", "");
    viewMore.addEventListener("click", () => {
      this.variantOptions.classList.add("ra-product-tile__options--expanded");
      viewMore.classList.add("!hidden");
    });
    this.optionContainer.append(viewMore);
    // The next step here is going to be figuring out which of the swatches are visible
    // and changing the number of variants based on this value
    const visibleWidth =
      this.optionContainer.offsetWidth - viewMore.offsetWidth;
    let width = 0;
    let swatchCount = 0;
    const visibleItems = Array.from(this.variantOptions.children).forEach(
      (c) => {
        if (width <= visibleWidth) {
          width += c.offsetWidth;
          swatchCount++;
        }
      }
    );
  }

  // This adds the scroll icons to the container
  buildArrows() {
    const arrowHandles = ["left", "right"];
    arrowHandles.forEach((handle) => {
      const arrow = document.createElement("div");
      arrow.classList.add(`product-tile__arrow--${handle}`);
      arrow.setAttribute("data-scroll-button", "");
      arrow.setAttribute(`data-scroll-${handle}`, "");
      arrow.addEventListener("click", () => {
        let newScrollLeft = this.variantOptions.scrollLeft;
        if (handle == "left") {
          newScrollLeft -= 50;
        } else if (handle == "right") {
          newScrollLeft += 50;
        }
        this.animateScroll(newScrollLeft, 300);
        this.displayArrows(newScrollLeft);
      });
      if (
        (handle == "left" && this.variantOptions.scrollLeft == 0) ||
        (handle == "right" &&
          this.maxScrollLeft == 0 &&
          this.variantOptions.scrollLeft != 0)
      ) {
        arrow.classList.add("hidden");
      } else {
        arrow.classList.remove("hidden");
      }
      this.optionContainer.prepend(arrow);
    });
  }

  animateScroll(end, duration) {
    const element = this.variantOptions;
    const start = this.variantOptions.scrollLeft;
    var startTime = performance.now();

    function scrollStep() {
      var now = performance.now();
      var progress = (now - startTime) / duration;
      if (progress > 1) progress = 1;

      element.scrollLeft = start + (end - start) * progress;

      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    }

    requestAnimationFrame(scrollStep);
  }

  updatePrice() {
    if (this.currentVariant.compare_at_price) {
      this.priceCompare.classList.remove("hidden");
      this.price.classList.add("ra-price__special");
    } else {
      this.priceCompare.classList.add("hidden");
      this.price.classList.remove("ra-price__special");
    }
    if (this.price.dataset.price != this.currentVariant.price) {
      this.price.dataset.price = this.currentVariant.price;
      this.price.textContent = money(this.currentVariant.price);
    }
    if (
      this.price.dataset.priceCompare != this.currentVariant.compare_at_price
    ) {
      this.priceCompare.dataset.priceCompare =
        this.currentVariant.compare_at_price;
      this.priceCompare.textContent = money(
        this.currentVariant.compare_at_price
      );
    }
  }

  updateImages() {
    const currentSku = this.currentVariant.sku;
    const featuredImage = this.currentVariant.featured_media;
    const productImages = this.product.media;
    let mainImage =
      featuredImage ||
      productImages.find((img) => img.alt?.includes(currentSku));
    let hoverImage = productImages.find((img) => {
      return img.alt?.includes(currentSku) && img !== mainImage;
    });
    if (!mainImage) mainImage = productImages[0];
    if (!hoverImage) hoverImage = productImages[1];
    if (mainImage || hoverImage) {
      const mainImageSrc = mainImage?.preview_image.src + "&width=450";
      const hoverImageSrc = hoverImage?.preview_image.src + "&width=450";
      this.featuredImage?.setAttribute("src", mainImageSrc);
      this.altImage?.setAttribute("src", hoverImageSrc);
    }
  }

  updateAttribute() {
    this.productTitle.textContent = this.currentVariant.title;
  }

  updateProductUrl() {
    let productUrl = `/products/${this.product.handle}`;
    if (this.currentVariant?.id) {
      productUrl += `?variant=${this.currentVariant.id}`;
    }
    this.productUrl.setAttribute("href", productUrl);
  }
}
