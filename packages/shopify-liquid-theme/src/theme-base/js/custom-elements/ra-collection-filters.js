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

    axios
      .get(url)
      .then((res) => {
        const html = res.data;

        // Grab grid html from fetch with params and update DOM element
        const responseDOM = new DOMParser().parseFromString(html, "text/html");
        document.getElementById("ProductGrid").innerHTML =
          responseDOM.getElementById("ProductGrid").innerHTML;
        document.getElementById("CollectionFilters").innerHTML =
          responseDOM.getElementById("CollectionFilters").innerHTML;
        document.getElementById("CollectionActiveFilters").innerHTML =
          responseDOM.getElementById("CollectionActiveFilters").innerHTML;
      })
      .then(() => {
        RaCollectionFilters.addActiveFilterEventListeners();
      });
  }

  static onBrowserPrev() {
    let params = new URLSearchParams(window.location.search);
    RaCollectionFilters.renderSectionFromFetch(params);
  }

  static clearFilters() {
    RaCollectionFilters.renderSectionFromFetch("");
    updateURL("");
  }

  static getSearchParamString() {
    const filterForm = document.getElementById("CollectionFilters");
    const sortForm = document.querySelector("[name='sortBy']");
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

    return searchParamString;
  }

  static removeParamFromSearch(param) {
    let searchParamString = RaCollectionFilters.getSearchParamString();

    searchParamString = searchParamString
      .replace(param + "&", "")
      .replace(param, "");
    return searchParamString;
  }

  static addActiveFilterEventListeners() {
    const removeFilterBtns = document.querySelectorAll(
      "[data-action-remove-filter]"
    );

    removeFilterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();

        const param = btn.getAttribute("data-param");
        const value = btn.getAttribute("data-value");

        const paramToRemove = param + "=" + value;
        const searchParamString =
          RaCollectionFilters.removeParamFromSearch(paramToRemove);

        RaCollectionFilters.renderSectionFromFetch(searchParamString);
        updateURL(searchParamString);
      });
    });
  }

  connectedCallback() {
    const filterForm = document.getElementById("CollectionFilters");
    const clearAllBtn = document.querySelector("[data-clear-filters]");

    clearAllBtn.addEventListener("click", () => {
      RaCollectionFilters.clearFilters();
    });

    filterForm.addEventListener("change", () => {
      const searchParamString = RaCollectionFilters.getSearchParamString();
      RaCollectionFilters.renderSectionFromFetch(searchParamString);
      updateURL(searchParamString);
    });

    RaCollectionFilters.addActiveFilterEventListeners();

    /* Ensure that navigating through the browser "Back" button properly applies filters */
    window.addEventListener("popstate", RaCollectionFilters.onBrowserPrev);
  }
}
