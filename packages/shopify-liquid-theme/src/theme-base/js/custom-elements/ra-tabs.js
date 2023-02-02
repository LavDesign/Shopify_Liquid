export default class RaTabs extends HTMLElement {
  constructor() {
    super();
    this.tabItems = this.querySelectorAll(".ra-tab");
    this.tabToggleBtns = this.querySelectorAll(".ra-tab__toggle");
    this.tabContents = this.querySelectorAll(".ra-tab__content");
    this.isStacked = this.getAttribute("data-stack-mobile");
    this.mobile = 768;
  }

  connectedCallback() {
    if (this.tabItems === null || this.tabItems === undefined) return;
    window.addEventListener("resize", this.handleWindowResize.bind(this));
    this.render();
  }

  render() {
    this.handleWindowResize();
    this.toggleTab();
  }

  getNextSibling(elem, selector) {
    var sibling = elem.nextElementSibling;
    while (sibling) {
      if (sibling.matches(selector)) return sibling;
      sibling = sibling.nextElementSibling;
    }
  }

  // handle window resize - stack on mobile
  handleWindowResize() {
    if (window.innerWidth <= this.mobile && this.isStacked == "true") {
      this.classList.remove("ra-tabs--default");
      this.classList.add("ra-tabs--stack");
    } else {
      this.classList.remove("ra-tabs--stack");
      this.classList.add("ra-tabs--default");
    }
  }

  // set active collapsable tab
  setActiveTab(button) {
    const tabContent = this.getNextSibling(button, ".ra-tab__content");
    const contentHeight = tabContent.querySelector(
      ".ra-tab__content-inner"
    ).offsetHeight;
    if (!tabContent) return;

    this.tabContents.forEach((content) => {
      content.classList.remove("ra-tab__content--open");
      content.style.height = "0px";
    });

    this.tabToggleBtns.forEach((button) => {
      button.setAttribute("aria-pressed", false);
      button.classList.remove("ra-tab__toggle--open");
    });

    button.setAttribute("aria-pressed", true);
    button.classList.add("ra-tab__toggle--open");

    tabContent.classList.add("ra-tab__content--open");
    tabContent.style.height = "0px";
    tabContent.style.height = `${contentHeight}px`;
  }

  // attach event listener to toggle buttons
  toggleTab() {
    this.tabToggleBtns.forEach((button) => {
      button.addEventListener("click", () => {
        this.setActiveTab(button);
      });
    });
  }
}
