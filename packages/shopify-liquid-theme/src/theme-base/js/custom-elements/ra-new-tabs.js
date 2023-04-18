export default class RaNewTabs extends HTMLElement {
  constructor() {
    super();
    this.tabButtons = this.querySelectorAll("[data-tab]");
    this.tabContainer = this.querySelector("[data-tab-container]");
    this.tabPanels = this.tabContainer.querySelectorAll("[data-tab-target]");

    this.tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.classList.contains("active")) return false;
        const tabId = button.dataset.tab;

        // Hide all the tab panels
        const selectedTabPanel = this.tabContainer.querySelector(
          `[data-tab-target="${tabId}"]`
        );
        this.tabPanels.forEach((panel) => {
          if (
            panel != selectedTabPanel &&
            !panel.classList.contains("hidden")
          ) {
            panel.classList.toggle("hidden");
          }
        });
        selectedTabPanel.classList.toggle("hidden");

        // Set the active state on the selected tab button
        this.tabButtons.forEach((button) => {
          button.classList.remove("text-grey-900", "active");
        });
        button.classList.add("text-grey-900", "active");
      });
    });
  }
}
