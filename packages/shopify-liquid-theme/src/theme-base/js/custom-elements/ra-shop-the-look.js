export default class RaShopTheLook extends HTMLElement {
  constructor() {
    super();
    this.lookItems = Array.from(
      this.querySelectorAll(".ra-shop-the-look__item")
    );
    this.toggle = null;
  }

  connectedCallback() {
    this.init();
  }

  init() {
    this.initPopover();
  }

  get index() {
    // return [...this.toggle.parentNode.children].indexOf(this.toggle);
  }

  initPopover() {
    this.lookItems.forEach((item) => {
      item.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          this.togglePopover(button);
        });
      });
    });
  }

  togglePopover(toggleBtn) {
    this.lookItems.forEach((item) => {
      const product = item.querySelector(".ra-shop-the-look__product");
      if (
        product.getAttribute("id") === toggleBtn.getAttribute("aria-controls")
      ) {
        product.toggleAttribute("open");
      } else {
        product.removeAttribute("open");
      }
    });
  }
}
