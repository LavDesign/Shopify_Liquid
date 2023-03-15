export default class RaSearchBar extends HTMLElement {
  constructor() {
    super();
    this.isVisible = false;
    this.headerInner = document.querySelector(".header__inner");
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
  }

  toggleSearch() {
    this.isVisible ? this.hideSearch() : this.showSearch();
  }

  connectedCallback() {
    document
      .querySelector("[data-action-toggle-search]")
      .addEventListener("click", this.toggleSearch.bind(this));

    document.querySelectorAll("[data-action-close-search]").forEach((el) => {
      el.addEventListener("click", this.hideSearch.bind(this));
    });
  }
}
