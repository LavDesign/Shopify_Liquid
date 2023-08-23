export default class RaHeader extends HTMLElement {
  constructor() {
    super();
    this.stickyOffset = 50;
    this.headerPositionTop = "0px";
    this.headerDropdownTop = "0px";
    this.childLinks = this.querySelectorAll(
      ".header__navigation-item--has-child"
    );
    this.hamburger = document.querySelector("#header__hamburger");
    this.mobileNav = document.querySelector(".header__mobile-navigation");
    this.dropdownToggles = document.querySelectorAll("[data-toggle-dropdown]");
    this.drawerToggles = document.querySelectorAll("[data-toggle-drawer]");
    this.drawerCloseBtns = document.querySelectorAll("[data-close-drawer]");
    this.drawers = document.querySelectorAll(
      ".header__mobile-navigation-drawer"
    );
    this.dropdowns = document.querySelectorAll(
      ".header__mobile-navigation-dropdown"
    );
  }

  connectedCallback() {
    this.init();
    window.addEventListener("scroll", this.handleWindowScroll.bind(this));
    window.addEventListener("cartUpdated", this.updateCartBadge.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("cartUpdated", this.updateCartBadge.bind(this));
  }

  init() {
    this.preventEmptyLinks();
    this.setHeaderPosition();
    this.toggleMegaMenu();
    this.handleMobileNav();
    this.handleMobileDrawer();
    this.handleMobileDropdowns();
  }

  updateCartBadge(e) {
    const { item_count } = e.detail;
    const cart_badge = document.querySelector("[data-cart-badge]");
    if (item_count === 0) {
      cart_badge.classList.add("hidden");
    } else {
      cart_badge.querySelector("span").textContent = item_count;
      cart_badge.classList.remove("hidden");
    }
  }

  preventEmptyLinks() {
    const links = this.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        link.getAttribute("href") == "#" ? e.preventDefault() : true;
      });
    });
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

    // set global CSS vars
    this.style.setProperty("--header-position-top", this.headerPositionTop);
    this.style.setProperty("--dropdown-position-top", this.headerDropdownTop);
    document.documentElement.style.setProperty(
      "--header-height",
      this.clientHeight + "px"
    );
    document.documentElement.style.setProperty(
      "--content-position-top",
      parseInt(this.headerPositionTop) + this.clientHeight + "px"
    );
  }

  handleWindowScroll() {
    if (window.scrollY < this.stickyOffset) {
      this.setHeaderPosition();
    } else {
      this.setHeaderPosition(true);
    }
  }

  toggleMegaMenu() {
    this.childLinks.forEach((link) => {
      link.addEventListener("mouseover", () => {
        link
          .querySelector(".header__navigation-dropdown")
          .classList.add("active");
        link.classList.add("active");
      });

      link.addEventListener("mouseout", () => {
        link
          .querySelector(".header__navigation-dropdown")
          .classList.remove("active");
        link.classList.remove("active");
      });
    });
  }

  handleMobileNav() {
    this.hamburger.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.classList.toggle("overflow-hidden");
      this.hamburger.classList.toggle("active");
      this.mobileNav.classList.toggle("active");
    });
  }

  handleMobileDrawer() {
    if (!this.drawerToggles) return;

    // open drawers
    this.drawerToggles.forEach((btn) => {
      const btnToggleId = btn.getAttribute("data-toggle-drawer");
      const btnText = btn.getAttribute("title");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.drawers.forEach((drawer) => {
          drawer.classList.remove("active");
        });
        const selectedDropdown = document.getElementById(btnToggleId);
        selectedDropdown.querySelector(
          ".header__mobile-navigation-drawer-title"
        ).innerHTML = btnText;
        selectedDropdown.classList.add("active");
      });
    });
    // close drawers
    this.drawerCloseBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.drawers.forEach((drawer) => {
          drawer.classList.remove("active");
        });
      });
    });
  }

  handleMobileDropdowns() {
    this.dropdownToggles.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const isActive = btn.classList.contains("active");
        this.dropdowns.forEach((dropdown) => {
          dropdown.classList.remove("active");
          dropdown.style.setProperty("--dropdown-height", "0px");
        });
        this.querySelectorAll("[data-toggle-dropdown]").forEach(
          (dropdownLink) => {
            dropdownLink.classList.remove("active");
          }
        );

        if (!isActive) {
          const toggleId = btn.getAttribute("data-toggle-dropdown");
          btn.classList.toggle("active");
          const selectedDropdown = document.getElementById(toggleId);
          const dropdownHeight = selectedDropdown.querySelector(
            "[data-header-inner-mobile]"
          ).offsetHeight;
          selectedDropdown.style.setProperty(
            "--dropdown-height",
            dropdownHeight + "px"
          );
          document.getElementById(toggleId).classList.toggle("active");
        }
      });
    });
  }
}
