import { money } from "../utils/money.js";
import { getToken } from "@bva/ui-shared/helpers";

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
    this.overflowStyleDesktop = "expand"; // expecting expand, arrow, or drag
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

  handleResize() {
    const newBreakpoint =
      window.innerWidth > this.breakpointPixelMD ? "desktop" : "mobile";
    if (this.productTileBreakpoint !== newBreakpoint) {
      this.productTileBreakpoint = newBreakpoint;
      this.toggleArrows();
      this.toggleExpander();
    }
    if (
      (this.overflowStyleDesktop === "expand" && newBreakpoint === "desktop") ||
      (this.overflowStyleMobile === "expand" && newBreakpoint === "mobile")
    ) {
      this.displayViewMore();
    }
  }

  toggleExpander() {
    const viewMore = this.querySelector("[data-view-more]");
    const viewLess = this.querySelector("[data-view-less]");
    if (
      (this.productTileBreakpoint === "desktop" &&
        this.overflowStyleDesktop === "expand") ||
      (this.productTileBreakpoint === "mobile" &&
        this.overflowStyleMobile === "expand")
    ) {
      viewMore.classList.remove("hidden");
      viewLess.classList.add("hidden");
      if (this.variantCarousel.swiper) {
        this.variantCarousel.swiper.draggable = false;
        this.variantCarousel.swiper.allowTouchMove = false;
      }
    } else {
      viewMore.classList.add("hidden");
      viewLess.classList.add("hidden");
      if (this.variantCarousel.swiper) {
        this.variantCarousel.swiper.draggable = true;
        this.variantCarousel.swiper.allowTouchMove = true;
      }
    }
  }

  buildViewMore() {
    const viewMore = document.createElement("div");
    viewMore.innerHTML = `
    <span data-count></span>+ more`;
    viewMore.classList.add("product-tile__view-more", "hidden");
    viewMore.setAttribute("data-view-more", "");
    viewMore.addEventListener("click", () => toggleViewMore());
    const viewLess = document.createElement("span");
    viewLess.innerText = "See Less";
    viewLess.classList.add("hidden", "product-tile__view-less");
    viewLess.setAttribute("data-view-less", "");
    viewLess.addEventListener("click", () => toggleViewLess());
    this.optionContainer.append(viewMore);
    this.optionContainer.append(viewLess);

    const toggleViewMore = () => {
      this.variantCarousel.swiper.draggable = true;
      this.variantCarousel.swiper.allowTouchMove = true;
      viewMore.classList.add("hidden");
      viewLess.classList.toggle("hidden");
    };

    const toggleViewLess = () => {
      this.variantCarousel.swiper.draggable = false;
      this.variantCarousel.swiper.allowTouchMove = false;
      viewMore.classList.remove("hidden");
      viewLess.classList.add("hidden");
    };
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
    } else {
      viewMore.classList.add("hidden");
    }
  }

  buildArrows() {
    const arrowHandles = ["left", "right"];
    arrowHandles.forEach((handle) => {
      const arrow = document.createElement("button");
      const arrow_background = document.createElement("span");
      arrow.prepend(arrow_background);
      arrow.classList.add(`product-tile__arrow--${handle}`, "hidden");
      arrow.setAttribute("data-scroll-button", "");
      arrow.setAttribute(`data-scroll-${handle}`, "");
      if (handle === "left") {
        this.variantCarousel?.addEventListener("reachbeginning", () => {
          arrow.classList.add("hidden");
        });
      } else if (handle === "right") {
        this.variantCarousel?.addEventListener("reachend", () => {
          arrow.classList.add("hidden");
        });
      }
      this.variantCarousel?.addEventListener("fromedge", () => {
        if (
          (this.productTileBreakpoint === "desktop" &&
            this.overflowStyleDesktop === "arrow") ||
          (this.productTileBreakpoint === "mobile" &&
            this.overflowStyleMobile === "arrow")
        ) {
          arrow.classList.remove("hidden");
        }
      });
      if (handle == "left") {
        arrow.classList.add("hidden");
      }
      this.optionContainer.prepend(arrow);
    });
  }

  toggleArrows() {
    const arrows = this.querySelectorAll("[data-scroll-button]");
    if (
      (this.productTileBreakpoint === "desktop" &&
        this.overflowStyleDesktop === "arrow") ||
      (this.productTileBreakpoint === "mobile" &&
        this.overflowStyleMobile === "arrow")
    ) {
      arrows.forEach((arrow) => {
        if (
          (arrow.hasAttribute("data-scroll-left") &&
            this.variantCarousel?.swiper?.isBeginning === false) ||
          (arrow.hasAttribute("data-scroll-right") &&
            this.variantCarousel?.swiper?.isEnd === false)
        ) {
          arrow.classList.remove("hidden");
        }
      });
    } else {
      arrows.forEach((arrow) => arrow.classList.add("hidden"));
    }
  }

  // SWATCH FUNCTIONS
  initializeSwatches() {
    this.variantSwatches.forEach((option) => {
      option.addEventListener("click", this.swatchClick.bind(this));
    });
    window.addEventListener("resize", this.handleResize.bind(this));
    this.variantCarousel?.addEventListener("afterinit", () => {
      this.toggleArrows();
      this.toggleExpander();
    });
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

  // VARIANT CHANGE FUNCTIONS

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
    if (
      updatedBadge &&
      this.productBadge &&
      this.productBadge?.textContent != updatedBadge
    ) {
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

  // HELPERS

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
