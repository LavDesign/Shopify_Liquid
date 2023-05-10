import { money } from "../utils/money";

export default class RaProductTile extends HTMLElement {
  constructor() {
    super();
    // Setting the product and current variant
    this.product = JSON.parse(this.getAttribute("data-product"));
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
    this.swatchOverflowStyle = "scroll";
    this.optionContainer = this.querySelector("[data-option-container]");
    this.variantOptions = this.querySelector("[data-variant-options]");
    // Determine what the maximum scrollable value is to determine
    // whether or not to display the arrows
    this.maxScrollLeft =
      this.variantOptions?.scrollWidth - this.variantOptions?.clientWidth;
    // Testing with draggable container
    this.startClick;
    this.dragAmount;
  }

  connectedCallback() {
    if (this.variantOptions?.children?.length > 0) {
      this.swatchOverflow();
      Array.from(this.variantOptions.children).forEach((option) => {
        option.addEventListener("click", this.swatchClick.bind(this));
      });
      window.addEventListener("resize", this.handleResize.bind(this));
    }
  }

  handleResize() {
    const newMaxScrollLeft =
      this.variantOptions.scrollWidth - this.variantOptions.clientWidth;
    if (this.maxScrollLeft != newMaxScrollLeft) {
      this.maxScrollLeft = newMaxScrollLeft;
      this.displayArrows(this.variantOptions.scrollLeft);
    }
  }

  setCurrentVariant(variant) {
    this.currentVariant = variant;
    this.updateProductUrl();
    this.updateImages();
    this.updatePrice();
    this.updateAttribute();
  }

  swatchClick(e) {
    const activeOption = e.target;
    if (activeOption.classList.contains("active")) return false;
    const { optionPosition, optionValue } = activeOption.dataset;
    const newOptions = Array.from(this.currentVariant.options);
    Array.from(activeOption.parentElement.children).forEach((option) => {
      option.classList.remove("active");
    });
    activeOption.classList.add("active");
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
      // This adds drag capability
      this.optionContainer.addEventListener("mousedown", (e) => {
        this.startClick = e.clientX;
        this.dragAmount = this.variantOptions.scrollLeft;
      });

      this.optionContainer.addEventListener("mousemove", (e) => {
        if (this.startClick) {
          const draggedTo = e.clientX - this.startClick;
          this.variantOptions.scrollLeft = this.dragAmount - draggedTo;
        }
      });

      this.optionContainer.addEventListener("mouseup", () => {
        this.startClick = null;
      });

      this.optionContainer.classList.add("px-4");
    } else if (
      this.swatchOverflowStyle == "expand" &&
      this.variantOptions.children.length > 3
    ) {
      const viewMore = document.createElement("div");
      viewMore.textContent = "+X more";
      viewMore.classList.add("product-tile__view-more");
      viewMore.addEventListener("click", () => {
        this.variantOptions.classList.add("ra-product-tile__options--expanded");
        viewMore.classList.add("!hidden");
      });
      this.optionContainer.append(viewMore);
    }
  }

  normalizeScroll(scrollValue) {
    const newScrollValue = Math.max(
      0,
      Math.min(scrollValue, this.maxScrollLeft)
    );
    this.displayArrows(newScrollValue);
    return newScrollValue;
  }

  displayArrows(newScrollValue) {
    const leftScroll = this.querySelector("[data-scroll-left]");
    const rightScroll = this.querySelector("[data-scroll-right]");
    if (newScrollValue == 0) {
      leftScroll.classList.add("hidden");
    } else {
      leftScroll.classList.remove("hidden");
    }
    if (newScrollValue == this.maxScrollLeft) {
      rightScroll.classList.add("hidden");
    } else {
      rightScroll.classList.remove("hidden");
    }
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
        this.animateScroll(this.normalizeScroll(newScrollLeft), 300);
      });
      if (
        (handle == "left" && this.variantOptions.scrollLeft == 0) ||
        (handle == "right" && this.maxScrollLeft == 0)
      ) {
        arrow.classList.add("hidden");
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
    const mainImageSrc = mainImage.preview_image.src + "&width=450";
    const hoverImageSrc = hoverImage.preview_image.src + "&width=450";
    this.featuredImage.setAttribute("src", mainImageSrc);
    this.altImage.setAttribute("src", hoverImageSrc);
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
