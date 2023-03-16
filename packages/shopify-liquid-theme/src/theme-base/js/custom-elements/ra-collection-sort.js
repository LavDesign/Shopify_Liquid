import axios from "axios";
import { getSearchParamsFromForm, updateURL } from "../utils/search-params";
export default class RaCollectionSort extends HTMLElement {
  constructor() {
    super();
  }

  //* TODO: Add a method to render from cache
  //* Reference Dawn's implementation for example

  // Pull this into a util function
  static renderSectionFromFetch(searchParamString) {
    const sectionId = document.getElementById("ra-collection-section").dataset
      .sectionId;
    const url = `${window.location.pathname}?section_id=${sectionId}&${searchParamString}`;

    axios.get(url).then((res) => {
      const html = res.data;

      // Grab grid html from fetch with params and update DOM element
      document.getElementById("ProductGrid").innerHTML = new DOMParser()
        .parseFromString(html, "text/html")
        .getElementById("ProductGrid").innerHTML;

      updateURL(searchParamString);
    });
  }

  connectedCallback() {
    const sortForm = this.querySelector("[name='sortBy']");
    const filterForm = document.getElementById("CollectionFilters");

    sortForm.addEventListener("change", () => {
      const filterFormData = getSearchParamsFromForm(filterForm);
      const sortFormData = getSearchParamsFromForm(sortForm);

      let searchParamString;

      if (filterFormData) {
        searchParamString = [
          new URLSearchParams(filterFormData).toString(),
          new URLSearchParams(sortFormData).toString(),
        ].join("&");
      } else {
        searchParamString = new URLSearchParams(sortFormData).toString();
      }

      RaCollectionSort.renderSectionFromFetch(searchParamString);
    });
  }
}
