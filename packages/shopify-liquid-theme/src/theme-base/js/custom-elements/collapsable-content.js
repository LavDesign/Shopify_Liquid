class CollapsableContent extends HTMLElement {
  constructor() {
    super();
    this.tabItems = this.querySelectorAll(".collapsable-item");
    this.toggleAccordion = this.toggleAccordion.bind(this);
  }

  connectedCallback() {
    this.render();
    if (this.tabItems === null || this.tabItems === undefined) return;

    this.tabItems.forEach((item) => {
      item.setAttribute("data-toggled", false);
      item
        .querySelector("button.collapsable-toggle")
        .addEventListener("click", () => {
          this.toggleTab(item.querySelector("button.collapsable-toggle"));
        });
    });
  }

  toggleAccordion() {}

  render() {
    console.log(this.tabItems);
  }

  toggleTab(button) {
    console.log(button);
    const toggled = Boolean(button.getAttribute("data-toggled"));
    button.setAttribute("data-toggled", true);

    console.log(toggled);
  }
}

window.customElements.define("collapsable-content", CollapsableContent);
