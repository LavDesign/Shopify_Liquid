export default class RaMediaGallery extends HTMLElement {
  constructor() {
    super();
    this.lightBoxTriggers = this.querySelectorAll("[data-lightbox-trigger]");
    this.lightBoxGallery = this.querySelector(
      "[data-dialog-id='lightbox-gallery']"
    );
    this.open = false;
    this.swiperEl = this.querySelector(".swiper--lightbox");
  }

  connectedCallback() {
    if (this.lightBoxTriggers.length > 0) {
      this.lightBoxTriggers.forEach((trigger) =>
        trigger.addEventListener("click", (e) => this.triggerModal(e))
      );
    }

    this.lightBoxGallery.addEventListener("click", (e) => {
      // if the dialog backdrop pseudoelement is clicked, close the dialog
      if (e.target === this.lightBoxGallery) {
        this.lightBoxGallery.close();
        document.body.classList.remove("fixed", "w-full");
      }
    });
  }

  triggerModal(e) {
    this.lightBoxGallery.showModal();
    document.body.classList.add("fixed", "w-full");

    const slideIndex = parseInt(
      e.currentTarget?.getAttribute("data-slide-index")
    );

    this.swiperEl.swiper.slideTo(slideIndex, 0);
  }
}
