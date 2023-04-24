export default class RaCartToggle extends HTMLElement {
  super() {}

  connectedCallback() {
    this.toggleButton = this.querySelector("[data-toggle-cart]");
    this.toggleButton.addEventListener("click", this.cartClick);
  }

  cartClick(e) {
    if (window.location.pathname !== "/cart") {
      window.dispatchEvent(
        new CustomEvent("toggleCart", {
          detail: {
            track: true,
          },
        })
      );
    }
    e.preventDefault();
  }
}
