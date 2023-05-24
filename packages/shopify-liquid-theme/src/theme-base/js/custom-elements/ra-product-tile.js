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
    // Determine what the maximum scrollable value is to determine
    // whether or not to display the arrows
    this.maxScrollLeft =
      this.variantOptions?.scrollWidth - this.variantOptions?.clientWidth;
    this.activeFilters;
  }

  connectedCallback() {
    this.activeFilters = this.getActiveFilters();
    this.setCurrentVariant(this.currentVariant);
    if (this.variantOptions?.children?.length > 0) {
      this.updateCurrentVariant();
      this.initializeSwatches();
    }
  }

  initializeSwatches() {
    this.maxScrollLeft =
      this.variantOptions.scrollWidth - this.variantOptions.clientWidth;
    this.swatchOverflow();
    [...this.variantOptions.children].forEach((option) => {
      option.addEventListener("click", this.swatchClick.bind(this));
    });
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  getActiveFilters() {
    const { search } = window.location;
    const activeFilters = {};
    const params = search.slice(1).split("&");
    params.forEach((param) => {
      if (param.includes("filter.v.option.")) {
        const [key, value] = param.split("filter.v.option.")[1].split("=");
        activeFilters[key] = activeFilters[key] || [];
        activeFilters[key].push(value);
      }
    });

    return activeFilters;
  }

  handleResize() {
    const newMaxScrollLeft =
      this.variantOptions.scrollWidth - this.variantOptions.clientWidth;
    if (this.swatchOverflowStyle === "expand") {
      this.displayViewMore();
      this.displayViewLess();
    } else if (
      this.swatchOverflowStyle == "scroll" &&
      this.maxScrollLeft != newMaxScrollLeft
    ) {
      this.displayArrows(this.variantOptions.scrollLeft);
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
    [...this.variantOptions.children].forEach((option) => {
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

  swatchClick(e) {
    const activeOption = e.target;
    const { optionPosition, optionValue } = activeOption.dataset;
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

  displayArrows(newScrollValue = 0) {
    const leftScroll = this.querySelector("[data-scroll-left]");
    const rightScroll = this.querySelector("[data-scroll-right]");
    const hasOverflow =
      this.variantOptions.clientWidth < this.variantOptions.scrollWidth;

    this.optionContainer.classList.toggle("px-4", hasOverflow);
    this.maxScrollLeft = hasOverflow
      ? this.variantOptions.scrollWidth - this.variantOptions.clientWidth
      : 0;
    leftScroll.classList.toggle("hidden", newScrollValue <= 0);
    rightScroll.classList.toggle(
      "hidden",
      newScrollValue >= this.maxScrollLeft
    );
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
      [...this.variantOptions.children].forEach((option) => {
        option.style.opacity = 1;
      });
    });
    const viewLess = document.createElement("span");
    viewLess.innerText = "View Less";
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
    const children = [...this.variantOptions.children];
    return (
      children[1].offsetLeft -
      (children[0].offsetLeft + children[0].offsetWidth)
    );
  }

  displayViewMore() {
    const viewMore = this.querySelector("[data-view-more]");
    const children = [...this.variantOptions.children];
    if (this.variantOptions.scrollWidth > this.variantOptions.clientWidth) {
      const maxWidth = this.variantOptions.clientWidth - viewMore.offsetWidth;
      const gridGap = this.calculateGridGap();
      let currentOffset = 0;
      const hiddenChildren = [];
      const visibleChildren = children.reduce((acc, child) => {
        if (currentOffset + child.offsetWidth < maxWidth) {
          child.style.opacity = 1;
          currentOffset += child.offsetWidth + gridGap;
          return [...acc, child];
        } else if (currentOffset + child.offsetWidth / 4 < maxWidth) {
          child.style.opacity = 1;
          return acc;
        } else {
          child.style.opacity = 0;
          hiddenChildren.push(child);
          return acc;
        }
      }, []);
      this.querySelector("[data-count]").textContent =
        children.length - visibleChildren.length;
      viewMore?.classList.remove("!hidden");
    } else {
      viewMore?.classList.add("!hidden");
      children.forEach((child) => (child.style.opacity = 1));
    }
  }

  displayViewLess() {
    const viewLess = this.querySelector("[data-view-less]");
    const children = [...this.variantOptions.children];
    const gridGap = this.calculateGridGap();
    const lastChild = children[children.length - 1];
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
        this.variantOptions.scrollWidth >= this.variantOptions.clientWidth &&
        this.variantOptions.offsetHeight != lastChild.offsetHeight
      )
    ) {
      viewLess.classList.add("!hidden");
    } else {
      viewLess.classList.remove("!hidden");
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
    let productUrl = `/products/${this.product.handle}`;
    if (this.currentVariant?.id) {
      productUrl += `?variant=${this.currentVariant.id}`;
    }
    this.productUrl.setAttribute("href", productUrl);
  }
}
