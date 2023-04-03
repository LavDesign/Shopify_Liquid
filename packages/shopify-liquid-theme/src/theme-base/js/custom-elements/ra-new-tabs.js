export default class RaNewTabs extends HTMLElement {
  constructor() {
    super();
    this.externalToggle = this.getAttribute("external-toggle");
    this.id = this.getAttribute("id");
    this.tabButtons = document.querySelectorAll("[data-tab]");
    this.tabContainer = document.querySelector("[data-tab-container]");
    this.animating = false;

    this.tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (this.animating || button.classList.contains("active")) return false;

        const tabId = button.dataset.tab;

        // Hide all the tab panels
        const tabPanels = document.querySelectorAll(".tab-panel");
        const selectedTabPanel = document.querySelector(
          `.tab-panel[data-tab="${tabId}"]`
        );
        tabPanels.forEach((panel) => {
          if (
            panel != selectedTabPanel &&
            !panel.classList.contains("hidden")
          ) {
            panel.classList.toggle("closing");
            setTimeout(() => {
              panel.classList.toggle("hidden");
              panel.classList.toggle("closing");
            }, 250);
          }
        });
        setTimeout(() => {
          selectedTabPanel.classList.toggle("opening");
          selectedTabPanel.classList.toggle("hidden");
        }, 250);

        setTimeout(() => {
          selectedTabPanel.classList.toggle("opening");
        }, 750);

        // Set the active state on the selected tab button
        this.tabButtons.forEach((button) => {
          button.classList.remove("text-grey-900", "active");
        });
        button.classList.add("text-grey-900", "active");
        this.animating = false;
      });
    });
  }
}
