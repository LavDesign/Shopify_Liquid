export default class RaHeader extends HTMLElement {
  constructor() {
    super();
    this.mobileScreen = 768;
    this.stickyOffset = 50;
    this.headerPositionTop = "0px";
    this.headerDropdownTop = "0px";
    this.windowWidth = window.innerWidth;
    this.childLinks = this.querySelectorAll(
      ".header__navigation-item--has-child"
    );
    this.hamberger = document.querySelector("#header__hamberger");
    this.mobileNav = document.querySelector(".header__mobile-navigation");
    this.dropdownToggles = document.querySelectorAll("[data-toggle-dropdown]");
    this.drawerToggles = document.querySelectorAll("[data-toggle-drawer]");
    this.drawerCloseBtns = document.querySelectorAll(".header__mobile-navigation-drawer-close");
    this.drawers = document.querySelectorAll(".header__mobile-navigation-drawer");
    this.dropdowns = document.querySelectorAll(".header__mobile-navigation-dropdown");
  }

  connectedCallback() {
    this.init();
    window.addEventListener("scroll", this.handleWindowScroll.bind(this));
  }

  init() {
		this.preventEmptyLinks();
    this.setHeaderPosition();
    this.toggleMegaMenu();
    this.handleMobileNav();
		this.handleMobileDrawer();
		this.handleMobileDropdowns();
  }

  isMobile() {
    return this.windowWidth <= this.mobileScreen;
  }

	preventEmptyLinks() {
		const links = this.querySelectorAll("a");
		links.forEach((link) => {
			link.addEventListener("click", (e) => {
				(link.getAttribute("href") == "#") ? e.preventDefault() : true
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
      "--content-postion-top",
      Number(this.headerPositionTop.replace("px", "")) +
        Number(this.clientHeight) +
        "px"
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
		this.hamberger.addEventListener("click", (e) => {
			e.preventDefault();
			document.body.classList.toggle("overflow-hidden");
			this.hamberger.classList.toggle("active");
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
					drawer.classList.remove("active")
				});
				const selectedDrawer = document.getElementById(btnToggleId);
        selectedDrawer.querySelector(
          ".header__mobile-navigation-drawer-title"
        ).innerHTML = btnText;
				selectedDrawer.classList.add("active");
			});
		});
		
		// close drawers
		this.drawerCloseBtns.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				this.drawers.forEach((drawer) => {
					drawer.classList.remove("active")
				});
			});
		});
	}

	handleMobileDropdowns() {
		this.dropdownToggles.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				const toggleId = btn.getAttribute("data-toggle-dropdown");
				e.preventDefault();
				btn.classList.toggle("active");
				const seletedDropdown = document.getElementById(toggleId);
				const dropdownHeight = seletedDropdown.querySelector(".header__mobile-navigation-dropdown-inner").offsetHeight;
				seletedDropdown.style.setProperty("--dropdown-height", dropdownHeight + "px");
				document.getElementById(toggleId).classList.toggle("active");
			});
		});
	}
}
