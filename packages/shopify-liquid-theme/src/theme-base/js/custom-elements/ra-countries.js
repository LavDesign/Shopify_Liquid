export default class RaCountries extends HTMLElement {
  constructor() {
    super();
    this.title = "Countries";
    this.elements = {
      country_input: this.querySelector("input[name='country_code']"),
      language_input: this.querySelector("input[name='language_code']"),
      form: this.querySelector("form"),
    };
    this.querySelectorAll("a[data-country]").forEach((item) =>
      item.addEventListener("click", this.countryClick.bind(this))
    );
    this.initialize();
  }

  async fetchCountry() {
    try {
      const response = await fetch(
        window.Shopify.routes.root +
          "browsing_context_suggestions.json" +
          "?country[enabled]=true" +
          `&country[exclude]=${window.Shopify.country}` +
          "&language[enabled]=true" +
          `&language[exclude]=${window.Shopify.language}`
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching country:", error);
      throw error;
    }
  }

  async initialize() {
    try {
      const countryData = await this.fetchCountry();
      this.countryData = countryData;
    } catch (error) {
      return false;
    }
    if (this.countryData) {
      const detected_country = this.countryData.detected_values.country;
      const detected_country_object = window.shopify_available_countries.find(
        (x) =>
          x.iso_code?.toLowerCase() == detected_country.handle?.toLowerCase()
      );
      if (
        window.shopify_country_default !=
        this.countryData?.detected_values.country.handle.toLowerCase()
      ) {
        const country_checker_modal = this.querySelector(
          "[data-dialog-id=country-checker-modal]"
        );
        const country_toggles = this.querySelectorAll("[data-toggle-country]");
        const tab_containers = this.querySelectorAll("[data-tab-container]");
        if (country_checker_modal)
          this.countryModalToggle(
            country_checker_modal,
            detected_country_object
          );
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

  countryModalToggle(modal, detectedCountry) {
    const local_country_code = localStorage.getItem("shopify_country_code");
    const country_image = modal.querySelector("[data-country-image]");
    const country_names = Array.from(
      modal.querySelectorAll("[data-country-name]")
    );
    const currency_name = modal.querySelector("[data-currency-name]");
    const currency_symbol = modal.querySelector("[data-currency-symbol]");
    const submit_button = modal.querySelector("[data-set-country]");
    country_image.src = detectedCountry.flag_image;
    country_image.alt = detectedCountry.country_name;
    country_names.forEach((country_name) => {
      country_name.innerText = detectedCountry.country_name;
    });
    currency_name.innerText = detectedCountry.currency_name;
    currency_symbol.innerText = detectedCountry.currency_symbol;
    submit_button.addEventListener("click", (e) => {
      e.preventDefault();
      this.setCountry(detectedCountry.iso_code, detectedCountry.language_code);
    });
    if (
      local_country_code.toLowerCase() != window.Shopify.country.toLowerCase()
    ) {
      modal?.showModal();
    }
  }

  countryClick(e) {
    e.preventDefault();
    const { countryCode, languageCode } = e.target.dataset;
    this.setCountry(countryCode, languageCode);
  }

  setCountry(country_code, language_code) {
    this.elements.country_input.value = country_code;
    this.elements.language_input.value = language_code;
    if (this.elements.form) {
      localStorage.setItem("shopify_country_code", country_code);
      localStorage.setItem("shopify_language_code", language_code);
      this.elements.form.submit();
    }
  }
}
