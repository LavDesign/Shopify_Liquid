import { debounce } from "../utils/helpers";
import axios from "axios";
export default class RaSearchBar extends HTMLElement {
  constructor() {
    super();
    this.isVisible = false;
    this.headerInner = document.querySelector(".header__inner");
    this.searchForm = document.querySelector("[data-search-form]");
    this.searchInput = this.searchForm.querySelector("[name='q']");
    this.toggleEl = document.querySelector("[data-action-toggle-search");
    this.closeEls = document.querySelectorAll("[data-action-close-search]");
    this.searchResponse = document.querySelector("#SearchResponse");
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.toggleEl.addEventListener("click", this.toggleSearch.bind(this));
    this.closeEls.forEach((el) => {
      el.addEventListener("click", this.hideSearch.bind(this));
    });

    this.searchForm.addEventListener(
      "input",
      debounce((e) => {
        this.onInputChange(e);
      }, 300).bind(this)
    );
  }

  showSearch() {
    this.classList.remove("hidden");
    this.classList.add("grid");
    this.isVisible = true;
    this.headerInner.classList.add("hidden");
    this.headerInner.classList.remove("flex");
  }

  hideSearch() {
    this.isVisible = false;
    this.classList.add("hidden");
    this.classList.remove("grid");
    this.headerInner.classList.remove("hidden");
    this.headerInner.classList.add("flex");
    this.clearSearchResults();
  }

  toggleSearch() {
    this.isVisible ? this.hideSearch() : this.showSearch();
  }

  getSearchResponse(q) {
    const url = `${window.Shopify.routes.root}search/suggest`;
    const params = {
      q,
      section_id: "predictive-search",
      resources: {
        limit: 4,
        limit_scope: "each",
        options: {
          unavailable_products: "hide",
        },
      },
    };

    axios.get(url, { params }).then((res) => {
      const responseDOM = new DOMParser().parseFromString(
        res.data,
        "text/html"
      );

      this.searchResponse.innerHTML = responseDOM.querySelector(
        "#shopify-section-predictive-search"
      ).innerHTML;
    });
  }

  clearSearchResults() {
    this.searchResponse.innerHTML = "";
    this.searchInput.value = "";
  }

  renderSearchResults() {}

  onInputChange(e) {
    const val = e.target.value;
    if (val === "") {
      this.clearSearchResults();
    } else {
      this.getSearchResponse(val);
    }
  }

  connectedCallback() {}

  /* Predictive Search */
  /*
  - On key input, make API call to predictive search API
  - Pass in section ID as param to get results returned in template
  - Use DOM parser to get element? (might just be able to take the entire response)
  - Update DOM element with response
  */
}
