import { money } from "../utils/money";

export default class RaProductTile extends HTMLElement {
  constructor() {
    super();
    this.product = JSON.parse(this.getAttribute("data-product"));
    this.featuredImage = this.querySelector("[data-featured-image]");
    this.altImage = this.querySelector("[data-alt-image]");
    this.price = this.querySelector("[data-price]");
    this.priceCompare = this.querySelector("[data-price-compare]");
    this.variantOptions = this.querySelector("[data-variant-options]");
    this.variants = this.product.variants;
    this.currentVariant = this.product.variants.find(
      (variant) => variant.id == this.getAttribute("data-current-variant")
    );
    this.productOptions = this.querySelectorAll("[data-option-value]");
    this.productUrl = this.querySelector("[data-product-link]");
  }

  connectedCallback() {
    this.swatchOverflow();
    this.productOptions.forEach((option) => {
      option.addEventListener("click", this.swatchClick.bind(this));
    });
  }

  swatchClick(e) {
    const activeOption = e.target;
    if (activeOption.classList.contains("active")) return false;
    Array.from(activeOption.parentElement.children).forEach((option) => {
      option.classList.remove("active");
    });
    activeOption.classList.add("active");
    const { optionPosition, optionValue } = activeOption.dataset;
    const newOptions = this.currentVariant.options.slice();
    newOptions[optionPosition - 1] = optionValue;
    const newVariant = this.product.variants.find((variant) =>
      variant.options.every((value, index) => value === newOptions[index])
    );
    this.setCurrentVariant(newVariant);
  }

  setCurrentVariant(variant) {
    this.currentVariant = variant;
    console.log(variant);
    this.updateProductUrl();
    this.updateImages();
    this.updatePrice();
  }

  swatchOverflow() {
    // used to set up swatch overflow style
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

  updateProductUrl() {
    let productUrl = `/products/${this.product.handle}`;
    if (this.currentVariant?.id) {
      productUrl += `?variant=${this.currentVariant.id}`;
    }
    this.productUrl.setAttribute("href", productUrl);
  }
}
