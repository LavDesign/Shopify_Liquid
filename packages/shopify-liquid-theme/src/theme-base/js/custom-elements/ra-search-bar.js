import { debounce } from "../utils/helpers";
import { refreshReviewWidgets } from "../utils/vendors";
import { getToken } from "@bva/ui-shared/helpers";
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

    this.searchResponse.addEventListener("click", (e) => {
      if (e.target.classList.contains("predictive-search__overlay")) {
        this.hideSearch();
      }
    });
  }

  showSearch() {
    this.classList.remove("hidden");
    this.classList.add("grid");
    this.isVisible = true;
    this.headerInner.classList.add("hidden");
    this.headerInner.classList.remove("flex");
    const breakpointMd = getToken("breakpoints.px.md"); // 768px
    if (window.innerWidth < breakpointMd) {
      document.querySelector("body").classList.add("overflow-hidden");
    }
  }

  hideSearch() {
    this.isVisible = false;
    this.classList.add("hidden");
    this.classList.remove("grid");
    this.headerInner.classList.remove("hidden");
    this.headerInner.classList.add("flex");
    this.clearSearchResults();
    document.querySelector("body").classList.remove("overflow-hidden");
  }

  toggleSearch() {
    this.isVisible ? this.hideSearch() : this.showSearch();
  }

  getSearchResponse(q) {
    const url = `${window.Shopify.routes.root}search/suggest`;
    const params = {
      q,
      section_id: "ra-predictive-search",
      resources: {
        limit: 4,
        limit_scope: "each",
        options: {
          unavailable_products: "hide",
        },
      },
    };

    axios
      .get(url, { params })
      .then((res) => {
        const responseDOM = new DOMParser().parseFromString(
          res.data,
          "text/html"
        );

        this.searchResponse.innerHTML = responseDOM.querySelector(
          "#shopify-section-ra-predictive-search"
        ).innerHTML;

        const predictive_search = this.searchResponse.querySelector(
          "#predictive-search-results"
        );
        let content_position_top = getComputedStyle(
          document.querySelector("body")
        ).getPropertyValue("--content-position-top");
        content_position_top = parseInt(
          content_position_top.split("px").shift()
        );
        predictive_search.style.height = `${
          window.innerHeight - content_position_top
        }px`;
      })
      .then(() => {
        refreshReviewWidgets();
      });
  }

  clearSearchResults() {
    this.searchResponse.innerHTML = "";
    this.searchInput.value = "";
  }

  onInputChange(e) {
    const val = e.target.value;
    if (val === "") {
      this.clearSearchResults();
    } else {
      this.getSearchResponse(val);
    }
  }
}
