export default class RaHeader extends HTMLElement {
  constructor() {
    super();
    this.stickyOffset = 50;
    this.headerPositionTop = "0px";
    this.headerDropdownTop = "0px";
    this.links = this.querySelectorAll("a");
    this.childLinks = this.querySelectorAll(
      ".header__navigation-item--has-child"
    );
  }

  connectedCallback() {
    this.init();
    window.addEventListener("scroll", this.handleWindowScroll.bind(this));
  }

  init() {
    this.setHeaderPosition();
    this.preventEmptyLinks();
    this.toggleDropdown();
  }

  setHeaderPosition(reset = false) {
    const getPreHeader = document.querySelector(".ra-preheader");

    if (reset) {
      this.headerPositionTop = "0px";
      this.headerDropdownTop = this.clientHeight + "px";
    } else if (getPreHeader) {
      this.headerPositionTop = getPreHeader.clientHeight + "px";
      this.headerDropdownTop =
        this.clientHeight + getPreHeader.clientHeight - 2 + "px";
    }
    this.style.setProperty("--header-position-top", this.headerPositionTop);
    this.style.setProperty("--dropdown-position-top", this.headerDropdownTop);
    document.documentElement.style.setProperty(
      "--content-postion-top",
      getPreHeader.clientHeight + this.clientHeight + "px"
    );
  }

  handleWindowScroll() {
    if (window.scrollY < this.stickyOffset) {
      this.setHeaderPosition();
    } else {
      this.setHeaderPosition(true);
    }
  }

  preventEmptyLinks() {
    this.links.forEach((link) => {
      if (link.getAttribute("href") == "#") {
        link.addEventListener("mouseover", (e) => {
          e.preventDefault();
        });
      }
    });
  }

  toggleDropdown() {
    this.childLinks.forEach((link) => {
      link.addEventListener("mouseover", () => {
        link
          .querySelector(".header__navigation-dropdown")
          .classList.add("active");
      });

      link.addEventListener("mouseout", () => {
        link
          .querySelector(".header__navigation-dropdown")
          .classList.remove("active");
      });
    });
  }
}
