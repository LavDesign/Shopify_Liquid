export default class RaProductTile extends HTMLElement {
  constructor() {
    super();
    this.product = JSON.parse(this.getAttribute("data-product"));
    this.featuredImage = this.querySelector("[data-featured-image]");
    this.altImage = this.querySelector("[data-alt-image]");
    this.variants = this.product.variants;
    this.currentVariant = this.product.variants.find(
      (variant) => variant.id == this.getAttribute("data-current-variant")
    );
    this.productOptions = this.querySelectorAll("[data-option-value]");
    this.productUrl = this.querySelector("[data-product-link]");
  }

  connectedCallback() {
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
    this.updateProductUrl();
    this.updateImages();
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
    this.featuredImage.setAttribute("srcset", "");
    this.featuredImage.setAttribute("src", mainImage?.preview_image.src);
    this.altImage.setAttribute("srcset", "");
    this.altImage.setAttribute("src", hoverImage?.preview_image.src);
  }

  updateProductUrl() {
    let productUrl = `/products/${this.product.handle}`;
    if (this.currentVariant?.id) {
      productUrl += `?variant=${this.currentVariant.id}`;
    }
    this.productUrl.setAttribute("href", productUrl);
  }
}
