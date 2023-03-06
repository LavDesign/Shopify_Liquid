import axios from "axios";
import { getSearchParamsFromForm, updateURL } from "../utils/search-params";

export default class RaCollectionFilters extends HTMLElement {
  constructor() {
    super();
  }

  //* TODO: Add a method to render from cache
  //* Reference Dawn's implementation for example

  static renderSectionFromFetch(searchParamString) {
    const sectionId = document.getElementById("ra-collection-section").dataset
      .sectionId;
    const url = `${window.location.pathname}?section_id=${sectionId}&${searchParamString}`;

    axios.get(url).then((res) => {
      const html = res.data;

      // Grab grid html from fetch with params and update DOM element
      document.getElementById("product-grid").innerHTML = new DOMParser()
        .parseFromString(html, "text/html")
        .getElementById("product-grid").innerHTML;
    });
  }

  static onBrowserPrev() {
    let params = new URLSearchParams(window.location.search);
    RaCollectionFilters.renderSectionFromFetch(params);
  }

  connectedCallback() {
    const filterForm = document.getElementById("CollectionFilters");
    const sortForm = document.querySelector("[name='sortBy']");

    filterForm.addEventListener("change", () => {
      const filterFormData = getSearchParamsFromForm(filterForm);
      const sortFormData = sortForm ? getSearchParamsFromForm(sortForm) : null;
      let searchParamString;

      if (sortFormData) {
        searchParamString = [
          new URLSearchParams(filterFormData).toString(),
          new URLSearchParams(sortFormData).toString(),
        ].join("&");
      } else {
        searchParamString = new URLSearchParams(filterFormData).toString();
      }

      RaCollectionFilters.renderSectionFromFetch(searchParamString);
      updateURL(searchParamString);
    });

    /* Ensure that navigating through the browser "Back" button properly applies filters */
    window.addEventListener("popstate", RaCollectionFilters.onBrowserPrev);

    /*
    Sample URL String
    https://fab-development.myshopify.com/collections/all?filter.v.availability=1&filter.v.price.gte=&filter.v.price.lte=&filter.v.option.color=Black&filter.v.option.color=Blue&sort_by=title-ascending
    */
  }
}
