export default class RaCollectionSort extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    Shopify.queryParams = {};
    const queryString = window.location.search;

    if (queryString.length) {
      const urlParams = new URLSearchParams(queryString);

      for (let [key, value] of urlParams.entries()) {
        Shopify.queryParams[key] = value;
      }
    }

    const sortForm = this.querySelector("[name='sortBy']");

    sortForm.addEventListener("change", (e) => {
      const val = e.target.value;
      Shopify.queryParams.sort_by = val;
      location.search = new URLSearchParams(Shopify.queryParams).toString();
    });
  }
}
