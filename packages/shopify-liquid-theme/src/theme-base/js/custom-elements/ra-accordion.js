export default class RaAccordion extends HTMLElement {
  constructor() {
    super();
    this.items = this.querySelectorAll(".ra-accordion-item");
    this.allowMultipleOpen = this.getAttribute("data-multi-open");
    this.toggleAccordion = this.toggleAccordion.bind(this);
  }

  connectedCallback() {
    this.items.forEach((btn) => {
      this.toggleHeight(btn);
      btn.addEventListener("click", () => this.toggleAccordion(btn));
    });
  }

  toggleAccordion(btn) {
    btn.classList.toggle("open");
    this.toggleHeight(btn);
    if (this.allowMultipleOpen !== "true") {
      this.items.forEach((item) => {
        if (item !== btn) {
          item.classList.remove("open");
          this.toggleHeight(item);
        }
      });
    }
  }

  toggleHeight(btn) {
    const accordionContent = btn.querySelector(".ra-accordion-item__content");
    const contentHeight = accordionContent.children[0].offsetHeight;
    if (btn.classList.contains("open")) {
      accordionContent.style.height = `${contentHeight}px`;
    } else {
      accordionContent.style.height = "0px";
    }
  }
}
