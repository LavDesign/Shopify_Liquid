class RaAccordion extends HTMLElement {
  constructor() {
    super();
    this.items = this.querySelectorAll(".ra-accordion-item");
    this.allowMultipleOpen = this.getAttribute("data-multi-open");
    this.toggleAccordion = this.toggleAccordion.bind(this);
  }

  connectedCallback() {
    this.items.forEach((btn) =>
      btn.addEventListener("click", () => this.toggleAccordion(btn))
    );
  }

  toggleAccordion() {
    if (this.allowMultipleOpen !== "true") {
      this.items.forEach((item) => item.removeAttribute("open"));
    }
  }
}

window.customElements.define("ra-accordion", RaAccordion);
