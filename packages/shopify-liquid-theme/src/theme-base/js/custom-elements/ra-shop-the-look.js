export default class RaShopTheLook extends HTMLElement {
  constructor() {
    super();
    this.lookItems = Array.from(
      this.querySelectorAll(".ra-shop-the-look__item")
    );
    this.toggle = null;
  }

  connectedCallback() {
    this.init();

    // this.hasPendingTransition = false;
    // if (this.hasAttribute("reveal-on-scroll")) {
    //   this._setupVisibility();
    // }
    // if (this.lookItems.length > 1 && Shopify.designMode) {
    //   this.addEventListener("shopify:block:select", async (event) => {
    //     this.intersectionObserver.disconnect();
    //     await this.select(event.target.index, !event.detail.load);
    //     this.nav.animate(
    //       { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] },
    //       { duration: 0, fill: "forwards", easing: "ease-in-out" }
    //     );
    //   });
    // }
  }

  init() {
    this.initPopover();
  }

  get index() {
    // return [...this.toggle.parentNode.children].indexOf(this.toggle);
  }

  get selected() {
    return !this.hasAttribute("hidden");
  }

  initPopover() {
    this.lookItems.forEach((item) => {
      item
        .querySelector(".ra-shop-the-look__dot")
        .addEventListener("click", (e) => {
          e.preventDefault();
          this.togglePopover(e.target);
        });
    });
  }

  togglePopover(toggleBtn) {
    this.lookItems.forEach((item) => {
      const product = item.querySelector(".ra-shop-the-look__product");
      if (
        product.getAttribute("id") === toggleBtn.getAttribute("aria-controls")
      ) {
        product.toggleAttribute("open");
      } else {
        product.removeAttribute("open");
      }
    });
    // document.querySelector(
    //   `.ra-shop-the-look__product#${toggleBtn.getAttribute("aria-controls")}`
    // ).toggleAttribute("open");
  }

  // get index() {
  //   return [...this.parentNode.children].indexOf(this);
  // }
  // get selected() {
  //   return !this.hasAttribute("hidden");
  // }

  // async transitionToEnter(shouldAnimate = true) {
  //   this.removeAttribute("hidden");
  //   const dots = Array.from(this.querySelectorAll(".shop-the-look__dot"));
  //   dots.forEach((dot) => dot.style.opacity = 0);
  //   const animation = new CustomAnimation(new SequenceEffect([
  //     new ParallelEffect(Array.from(this.querySelectorAll(".shop-the-look__image")).map((item) => {
  //       return new CustomKeyframeEffect(item, { opacity: [1, 1] }, { duration: 0 });
  //     })),
  //     new CustomKeyframeEffect(this, { visibility: ["hidden", "visible"], zIndex: [0, 1], clipPath: ["inset(0 0 0 100%)", "inset(0 0 0 0)"] }, { duration: 500, easing: "cubic-bezier(1, 0, 0, 1)" }),
  //     new ParallelEffect(dots.map((item, index) => {
  //       return new CustomKeyframeEffect(item, { opacity: [0, 1], transform: ["scale(0)", "scale(1)"] }, { duration: 120, delay: 75 * index, easing: "ease-in-out" });
  //     }))
  //   ]));
  //   shouldAnimate ? animation.play() : animation.finish();
  //   await animation.finished;
  //   if (window.matchMedia(window.themeVariables.breakpoints.tabletAndUp).matches) {
  //     const firstPopover = this.querySelector(".shop-the-look__product-wrapper .shop-the-look__dot");
  //     firstPopover == null ? void 0 : firstPopover.setAttribute("aria-expanded", "true");
  //   }
  // }

  // async transitionToLeave(shouldAnimate = true) {
  //   this.setAttribute("hidden", "");
  //   const animation = new CustomAnimation(new CustomKeyframeEffect(this, { visibility: ["visible", "hidden"] }, { duration: 500 }));
  //   shouldAnimate ? animation.play() : animation.finish();
  //   return animation.finished;
  // }

  // get selectedIndex() {
  //   return this.lookItems.findIndex((item) => item.selected);
  // }

  // async _setupVisibility() {
  //   await this.untilVisible();
  //   const images = Array.from(this.lookItems[this.selectedIndex].querySelectorAll(".shop-the-look__image"));
  //   for (let image of images) {
  //     if (image.offsetParent !== null) {
  //       await imageLoaded(image);
  //     }
  //   }
  //   await this.lookItems[this.selectedIndex].transitionToEnter();
  //   if (this.nav) {
  //     this.nav.animate(
  //       { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] },
  //       { duration: 150, fill: "forwards", easing: "ease-in-out" }
  //     );
  //   }
  // }
}