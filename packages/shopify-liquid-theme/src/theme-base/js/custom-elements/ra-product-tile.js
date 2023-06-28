import { money } from "../utils/money";

export default class RaProductTile extends HTMLElement {
  constructor() {
    super();
    // Setting the product and current variant
    this.product = JSON.parse(this.getAttribute("data-product"));
    this.currentVariant = this.product.variants?.find(
      (variant) => variant.id == this.getAttribute("data-current-variant")
    );
    // Properties that update on Variant Switch
    this.featuredImage = this.querySelector("[data-featured-image]");
    this.altImage = this.querySelector("[data-alt-image]");
    this.price = this.querySelector("[data-price]");
    this.priceCompare = this.querySelector("[data-price-compare]");
    this.productUrl = this.querySelector("[data-product-link]");
    this.productTitle = this.querySelector("[data-variant-title]");
    this.productBadge = this.querySelector("[data-product-badge]");

    // Swatch Properties
    this.swatchOverflowStyle = "expand"; // expecting expand or scroll
    this.optionContainer = this.querySelector("[data-option-container]");
    this.variantOptions = this.querySelector("[data-variant-options]");
    this.variantSwatches = [...(this.variantOptions?.children || [])];
  }

  connectedCallback() {
    this.setCurrentVariant(this.currentVariant);
    if (this.variantSwatches.length > 1) {
      this.updateCurrentVariant();
      this.initializeSwatches();
    }
  }

  initializeSwatches() {
    this.swatchOverflow();
    this.variantSwatches.forEach((option) => {
      option.addEventListener("click", this.swatchClick.bind(this));
    });
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  handleResize() {
    if (this.swatchOverflowStyle === "expand") {
      this.displayViewMore();
      this.displayViewLess();
    } else if (this.swatchOverflowStyle == "scroll") {
      this.displayArrows();
    }
  }

  setCurrentVariant(variant) {
    this.currentVariant = variant;
  }

  updateCurrentVariant() {
    this.updateProductUrl();
    this.updateImages();
    this.updatePrice();
    this.updateAttribute();
    this.updateSwatch();
    this.updateBadge();
  }

  swatchClick(e) {
    const { optionPosition, optionValue } = e.target.dataset;
    const newOptions = [...this.currentVariant.options];
    newOptions[optionPosition - 1] = optionValue;
    const newVariant = this.product.variants?.find((variant) =>
      variant.options.every((value, index) => value === newOptions[index])
    );
    this.setCurrentVariant(newVariant);
    this.updateCurrentVariant();
  }

  swatchOverflow() {
    // used to set up swatch overflow style
    if (this.swatchOverflowStyle == "scroll") {
      this.buildArrows();
      this.displayArrows();
    } else if (this.swatchOverflowStyle == "expand") {
      this.buildViewMore();
      this.displayViewMore();
      this.displayViewLess();
    }
  }

  displayArrows() {
    const rightScroll = this.querySelector("[data-scroll-right]");
    this.optionContainer.classList.toggle("pr-4", this.hasOverflow());
    rightScroll?.classList.toggle("hidden", !this.hasOverflow());
  }

  buildViewMore() {
    const viewMore = document.createElement("div");
    viewMore.innerHTML = `
    <span data-count="0"></span>+${"\u00A0"}more`;
    viewMore.classList.add("product-tile__view-more");
    viewMore.setAttribute("data-view-more", "");
    viewMore.addEventListener("click", () => {
      this.variantOptions.classList.add("ra-product-tile__options--expanded");
      viewMore.classList.add("!hidden");
      viewLess.classList.remove("!hidden");
      this.displayViewLess();
      this.variantSwatches.forEach((option) => {
        option.style.opacity = 1;
      });
    });
    const viewLess = document.createElement("span");
    viewLess.innerText = "See Less";
    viewLess.classList.add("!hidden", "product-tile__view-less");
    viewLess.setAttribute("data-view-less", "");
    viewLess.addEventListener("click", () => {
      this.variantOptions.classList.remove(
        "ra-product-tile__options--expanded"
      );
      viewMore.classList.remove("!hidden");
      viewLess.classList.add("!hidden");
      this.displayViewMore();
    });
    this.optionContainer.append(viewMore);
    this.optionContainer.append(viewLess);
  }

  calculateGridGap() {
    return (
      this.variantSwatches[1].offsetLeft -
      (this.variantSwatches[0].offsetLeft + this.variantSwatches[0].offsetWidth)
    );
  }

  hasOverflow() {
    return this.variantOptions.scrollWidth > this.variantOptions.clientWidth;
  }

  displayViewMore() {
    const viewMore = this.querySelector("[data-view-more]");
    if (this.hasOverflow()) {
      const maxWidth = this.variantOptions.clientWidth - viewMore.offsetWidth;
      const gridGap = this.calculateGridGap();
      let currentOffset = 0;
      const visibleChildren = this.variantSwatches.reduce((acc, child) => {
        if (currentOffset + child.offsetWidth < maxWidth) {
          child.style.opacity = 1;
          currentOffset += child.offsetWidth + gridGap;
          return [...acc, child];
        } else if (currentOffset + child.offsetWidth / 4 < maxWidth) {
          child.style.opacity = 1;
          return acc;
        } else {
          child.style.opacity = 0;
          return acc;
        }
      }, []);
      this.querySelector("[data-count]").textContent =
        this.variantSwatches.length - visibleChildren.length;
      viewMore?.classList.remove("!hidden");
    } else {
      viewMore?.classList.add("!hidden");
      this.variantSwatches.forEach((child) => (child.style.opacity = 1));
    }
  }

  displayViewLess() {
    const viewLess = this.querySelector("[data-view-less]");
    const gridGap = this.calculateGridGap();
    const lastChild = this.variantSwatches[this.variantSwatches.length - 1];
    const lastChildEndPosition = lastChild.offsetLeft + lastChild.offsetWidth;
    const viewLessStartPosition = lastChildEndPosition + gridGap;
    if (
      viewLessStartPosition + viewLess.offsetWidth <
      this.variantOptions.clientWidth
    ) {
      if (!viewLess.classList.contains("absolute")) {
        viewLess.classList.add("absolute");
      }
      viewLess.style.left = viewLessStartPosition + "px";
    } else {
      viewLess.classList.remove("absolute");
      viewLess.style.left = "auto";
    }
    if (
      !(
        !this.hasOverflow() &&
        this.variantOptions.offsetHeight != lastChild.offsetHeight
      )
    ) {
      viewLess.classList.add("!hidden");
    } else {
      viewLess.classList.remove("!hidden");
    }
  }

  scrollSwatches() {
    const scrollWidth =
      this.variantSwatches[0].offsetWidth + this.calculateGridGap();
    this.animateScroll(scrollWidth, 300);
    this.displayArrows(scrollWidth);
  }

  // This adds the scroll icons to the container
  buildArrows() {
    const arrow = document.createElement("div");
    arrow.classList.add(`product-tile__arrow--right`);
    arrow.setAttribute(`data-scroll-right`, "");
    arrow.addEventListener("click", this.scrollSwatches.bind(this));
    if (!this.hasOverflow()) {
      arrow.classList.add("hidden");
    } else {
      arrow.classList.remove("hidden");
    }
    this.optionContainer.prepend(arrow);
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
    const featuredImage = this.currentVariant?.image?.default;
    const productImages = this.product?.images?.default;
    let mainImage =
      featuredImage ||
      productImages.find((img) => img.alt?.includes(currentSku));
    let hoverImage = productImages?.find((img) => {
      return img.alt?.includes(currentSku) && img !== mainImage;
    });
    if (productImages?.length > 0) {
      if (!mainImage) mainImage = productImages[0];
      if (!hoverImage && productImages?.[1]) hoverImage = productImages[1];
    }
    if (mainImage || hoverImage) {
      this.featuredImage?.setAttribute("src", mainImage.sizes.sm);
      this.altImage?.setAttribute("src", hoverImage.sizes.sm);
    }
  }

  updateAttribute() {
    this.productTitle.textContent = this.currentVariant.title;
  }

  updateProductUrl() {
    let productUrl;
    if (
      Shopify.country?.toLowerCase() !==
      window.shopify_country_default?.toLowerCase()
    ) {
      productUrl = `${window.shopify_locale_root}/products/${this.product.handle}`;
    } else {
      productUrl = `/products/${this.product.handle}`;
    }
    if (this.currentVariant?.id) {
      productUrl += `?variant=${this.currentVariant.id}`;
    }
    this.productUrl.setAttribute("href", productUrl);
  }

  updateBadge() {
    const updatedBadge = this.currentVariant?.badge || this.product?.badge;
    if (updatedBadge && this.productBadge?.textContent != updatedBadge) {
      this.productBadge.textContent = updatedBadge;
      this.productBadge?.classList.remove("hidden");
    } else if (!updatedBadge) {
      this.productBadge?.classList.add("hidden");
    }
  }

  updateSwatch() {
    this.variantSwatches.forEach((option) => {
      const input = option.querySelector("input");
      const label = option.querySelector("label");
      if (!input) return false;
      const { optionValue, optionPosition } = input.dataset;
      if (this.currentVariant[`option${optionPosition}`] == optionValue) {
        label.classList.add("active");
      } else {
        label.classList.remove("active");
      }
    });
  }
}
