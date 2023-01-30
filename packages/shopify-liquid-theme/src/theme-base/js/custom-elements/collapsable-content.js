class CollapsableContent extends HTMLElement {
  constructor() {
    super();
    this.tabItems = this.querySelectorAll(".collapsable-item");
    this.tabToggleBtns = this.querySelectorAll(".collapsable-toggle");
    this.tabContents = this.querySelectorAll(".collapsable-content");
    this.isStacked = this.getAttribute("data-stacked");
    this.windowsWidth = window.innerWidth;
  }

  connectedCallback() {
    if (this.tabItems === null || this.tabItems === undefined) return;
    this.stacked();
    this.render();
  }

  render() {
    this.toggleTab();
  }

  // default stack on mobile, desktop if [data-stacked="true]
  stacked() {
    console.log("isStacked", this.isStacked);

    if (this.isStacked == "false" || this.windowsWidth > 768) {
      const btnWrapper = document.createElement("div");
      btnWrapper.classList.add("collapsable-buttons");

      this.tabToggleBtns.forEach((button) => {
        const clone = button.cloneNode(true);
        btnWrapper.prepend(clone);
        this.prepend(btnWrapper);
        button.remove();
      });
      this.tabToggleBtns = this.querySelectorAll(".collapsable-toggle");
    }
  }

  // set active collapsable tab
  setActiveTab(button) {
    button.setAttribute("data-toggled", true);

    this.tabContents.forEach((content) => {
      const buttonId = button.getAttribute("data-toggle-id");
      const collapsableId = content.getAttribute("id");
      const contentHeight = content.querySelector(
        ".collapsable-content__inner"
      ).offsetHeight;

      console.log(contentHeight);

      // set active - found matching collapsable content
      if (collapsableId == buttonId) {
        content.setAttribute("data-expanded", true);
        content.style.height = `${contentHeight}px`;
      } else {
        content.setAttribute("data-expanded", false);
        content.style.height = "0px";
      }
    });
  }

  // attach event listener to toggle buttons
  toggleTab() {
    this.tabToggleBtns.forEach((button) => {
      button.setAttribute("data-toggled", false);

      button.addEventListener("click", () => {
        console.log(button);
        this.setActiveTab(button);
      });
    });

    console.log("toggleTab");
  }
}

window.customElements.define("collapsable-content", CollapsableContent);
