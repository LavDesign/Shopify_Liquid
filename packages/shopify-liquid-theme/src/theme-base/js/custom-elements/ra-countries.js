export default class RaCountries extends HTMLElement {
  constructor() {
    super();
    this.title = "Countries";
    this.current_locale = this.getAttribute("data-current-locale");
    this.default_locale = this.getAttribute("data-default-locale");
  }

  connectedCallback() {
    // The logic here is just a placeholder for displaying the Country Picker popup on load
    // to be replaced with an IP check to determine the initial location and put users in
    // the appropriate market.

    if (this.default_locale != this.current_locale) {
      const country_checker_modal = this.querySelector(
        "[data-dialog-id=country-checker-modal]"
      );
      const country_toggles = this.querySelectorAll("[data-toggle-country]");
      const tab_containers = this.querySelectorAll("[data-tab-container]");
      if (country_checker_modal) country_checker_modal?.showModal();
      country_toggles.forEach((country_toggle) =>
        country_toggle.addEventListener("click", () => {
          tab_containers.forEach((tab_container) =>
            tab_container.classList.toggle("hidden")
          );
        })
      );
    }
  }
}
