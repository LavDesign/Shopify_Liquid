import { money } from "../utils/money.js";
import { getToken } from '@bva/ui-shared/helpers';

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
    this.breakpointPixelMD = getToken("breakpoints.px.md");
    this.productTileBreakpoint;
    this.overflowStyleDesktop = "arrow"; // expecting expand, scroll, or drag
    this.overflowStyleMobile = "arrow";
    this.optionContainer = this.querySelector("[data-option-container]");
    this.variantOptions = this.querySelector("[data-variant-options]");
    this.variantCarousel = this.querySelector("swiper-container");
    this.variantSwatches = [...(this.variantCarousel?.children || [])];
  }

  connectedCallback() {
    this.setCurrentVariant(this.currentVariant);
    this.productTileBreakpoint =
      window.innerWidth > this.breakpointPixelMD ? "desktop" : "mobile";
    if (this.variantSwatches.length > 1) {
      this.updateCurrentVariant();
      this.initializeSwatches();
      this.buildArrows();
      this.buildViewMore();
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
    const newBreakpoint =
      window.innerWidth > this.breakpointPixelMD ? "desktop" : "mobile";
    if (this.productTileBreakpoint !== newBreakpoint) {
      this.productTileBreakpoint = newBreakpoint;
      // THIS IS WHERE WE CHECK SWATCH STYLES FOR DEVICES
      if (newBreakpoint === "desktop") {
        // We need to reset the experience
        if (this.overflowStyleDesktop === "expand") {
          // We display the expand experience

        } else if (this.overflowStyleDesktop === "arrow") {
          // we display the arrow experience
          this.toggleArrows();

        } else if (this.overflowStyleDesktop === "drag") {
          // we use the drag experience

        }
      } else {
        if (this.overflowStyleMobile === "expand") {
          // We display the expand experience

        } else if (this.overflowStyleMobile === "arrow") {
          // we display the arrow experience

        } else if (this.overflowStyleMobile === "drag") {
          // we use the drag experience

        }
      }


    }
    if (this.overflowStyleDesktop === "expand") {
      this.displayViewMore();
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
  }

  toggleViewMore(viewMore) {
    this.variantCarousel.swiper.draggable = true;
    this.variantCarousel.swiper.allowTouchMove = true;
    const sibling = this.querySelector(`
      [data-view-less]
    `);
    viewMore.classList.add("hidden");
    sibling.classList.toggle("hidden");
  }

  toggleViewLess(viewLess) {
    this.variantCarousel.swiper.draggable = false;
    this.variantCarousel.swiper.allowTouchMove = false;
    const sibling = this.querySelector(`
      [data-view-more]
    `);
    sibling.classList.remove("hidden");
    viewLess.classList.add("hidden");
  }

  buildViewMore() {
    const viewMore = document.createElement("div");
    viewMore.innerHTML = `
    <span data-count></span>+${"\u00A0"}more`;
    viewMore.classList.add("product-tile__view-more", "hidden");
    viewMore.setAttribute("data-view-more", "");
    viewMore.addEventListener("click", () => this.toggleViewMore(viewMore));
    const viewLess = document.createElement("span");
    viewLess.innerText = "See Less";
    viewLess.classList.add("hidden", "product-tile__view-less");
    viewLess.setAttribute("data-view-less", "");
    viewLess.addEventListener("click", () => this.toggleViewLess(viewLess));
    this.optionContainer.append(viewMore);
    this.optionContainer.append(viewLess);
  }

  displayViewMore() {
    const viewMore = this.querySelector(`
    [data-view-more]
  `);
    if (this.hasOverflow()) {
      this.variantCarousel.draggable = false;
      this.variantCarousel.allowTouchMove = false;
      const maxWidth = this.variantOptions.clientWidth - viewMore.offsetWidth;
      const gridGap = 8;
      let currentOffset = 0;
      const visibleChildren = this.variantSwatches.reduce((acc, child) => {
        if (currentOffset + child.offsetWidth < maxWidth) {
          child.style.opacity = 1;
          currentOffset += child.offsetWidth + gridGap;
          return [...acc, child];
        } else {
          return acc;
        }
      }, []);
      this.querySelector("[data-count]").textContent =
        this.variantSwatches?.length - visibleChildren?.length;
      viewMore.classList.remove("hidden");
    } else {
      viewMore.classList.add("hidden");
    }
  }

  displayViewLess() {
    const viewLess = this.querySelector(`[data-view-less]`);
    viewLess.classList.remove("hidden");
    viewLess.style.left = "auto";
  }

  buildArrows() {
    const arrowHandles = ["left", "right"];
    arrowHandles.forEach((handle) => {
      const arrow = document.createElement("div");
      const arrow_background = document.createElement("span");
      arrow.prepend(arrow_background);
      arrow.classList.add(`product-tile__arrow--${handle}`, "hidden");
      arrow.setAttribute("data-scroll-button", "");
      arrow.setAttribute(`data-scroll-${handle}`, "");
      if (handle === "left") {
        this.variantCarousel?.addEventListener("reachbeginning", () => {
          arrow.classList.add("hidden");
        })
      } else if (handle === "right") {
        this.variantCarousel?.addEventListener("reachend", () => {
          arrow.classList.add("hidden");
        })
      }
      this.variantCarousel?.addEventListener("fromedge", () => {
        arrow.classList.remove("hidden");
      });
      if (handle == "left") {
        arrow.classList.add("hidden");
      }
      this.optionContainer.prepend(arrow);
    });
  }

  toggleArrows() {
    const arrows = this.querySelectorAll("[data-scroll-button]");
    arrows.forEach((arrow) => {})

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

  calculateGridGap() {
    return (
      this.variantSwatches[1].offsetLeft -
      (this.variantSwatches[0].offsetLeft + this.variantSwatches[0].offsetWidth)
    );
  }

  hasOverflow() {
    return this.variantOptions.scrollWidth > this.variantOptions.clientWidth;
  }
}
