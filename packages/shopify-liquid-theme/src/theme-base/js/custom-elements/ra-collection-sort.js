import axios from "axios";
export default class RaCollectionSort extends HTMLElement {
  constructor() {
    super();
  }

  /*
  * TODO: Remove these notes after filters are complete
  * Implementation Notes:
  - get section id
  - build Shopify params object with:
  - section_id, current filter params, current sort params, any new params
  - make fetch request to page url with Shopify params object
  - retrieve response as html
  - update the main section content with response html
  - profit
  */

  //* TODO: Add a method to render from cache
  //* Reference Dawn's implementation for example

  static renderSectionFromFetch(searchParams) {
    const sectionId = document.getElementById("ra-collection-section").dataset
      .sectionId;
    const url = `${window.location.pathname}?section_id=${sectionId}&${searchParams}`;

    axios.get(url).then((res) => {
      const html = res.data;

      // Grab grid html from fetch with params and update DOM element
      document.getElementById("product-grid").innerHTML = new DOMParser()
        .parseFromString(html, "text/html")
        .getElementById("product-grid").innerHTML;
    });
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

      const searchParams = new URLSearchParams(Shopify.queryParams).toString();
      RaCollectionSort.renderSectionFromFetch(searchParams);
    });
  }
}
