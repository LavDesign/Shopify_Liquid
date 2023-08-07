import { getToken } from "@bva/ui-shared/helpers";
export default class RaAccordion extends HTMLElement {
  constructor() {
    super();
    this.items = this.querySelectorAll(".ra-accordion-item");
    this.allowMultipleOpen = this.getAttribute("data-multi-open");
    this.toggleAccordion = this.toggleAccordion.bind(this);
  }

  connectedCallback() {
    const breakpointMd = getToken("breakpoints.px.md"); // 768px
    this.items.forEach((btn) => {
      this.toggleHeight(btn);
      if (btn.classList.contains("open") && window.innerWidth < breakpointMd) {
        const accordionContent = btn.querySelector(
          ".ra-accordion-item__content"
        );
        accordionContent.style.height = `auto`;
      }
      const accordion_btn = btn.querySelector(".ra-accordion-item__header");
      accordion_btn.addEventListener("click", () => this.toggleAccordion(btn));
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
