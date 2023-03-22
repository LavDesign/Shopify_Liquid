export default class RaMediaGallery extends HTMLElement {
  constructor() {
    super();
    this.lightBoxTriggers = this.querySelectorAll("[data-lightbox-trigger]");
    this.lightBoxGallery = this.querySelector(
      "[data-dialog-id='lightbox-gallery']"
    );
    this.open = false;
    this.swiperEl = this.querySelector(".swiper--lightbox");
    this.primarySwiper = this.querySelector(
      ".ra-gallery-carousel__main swiper-container"
    );

    this.lightboxSwiper = this.querySelector(
      ".ra-gallery-carousel__lightbox swiper-container"
    );

    this.youtubeVideos = this.querySelectorAll(".video--youtube");

    this.loadVideoTriggers = this.querySelectorAll("[data-action-load-video]");
    this.setupEventListeners();
  }

  pauseGalleryVideos() {
    document.querySelectorAll(".ra-iframe--youtube").forEach((video) => {
      video.contentWindow.postMessage(
        '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
        "*"
      );
    });
    document.querySelectorAll(".ra-frame--vimeo").forEach((video) => {
      video.contentWindow.postMessage('{"method":"pause"}', "*");
    });
    document.querySelectorAll("video").forEach((video) => video.pause());
  }

  setupEventListeners() {
    if (this.lightBoxTriggers.length > 0) {
      this.lightBoxTriggers.forEach((trigger) =>
        trigger.addEventListener("click", (e) => this.triggerModal(e))
      );
    }

    this.lightBoxGallery.addEventListener("click", (e) => {
      // if the dialog backdrop pseudoelement is clicked, close the dialog
      if (e.target === this.lightBoxGallery) {
        this.pauseGalleryVideos();
        this.lightBoxGallery.close();
        document.body.classList.remove("fixed", "w-full");
      }
    });

    this.primarySwiper.addEventListener("slidechange", () => {
      this.pauseGalleryVideos();
    });

    this.lightboxSwiper.addEventListener("slidechange", () => {
      this.pauseGalleryVideos();
    });

    this.primarySwiper.addEventListener("beforeinit", () => {
      this.primarySwiper.querySelectorAll("swiper-slide").forEach((slide) => {
        slide.classList.remove("hidden");
      });
    });

    this.loadVideoTriggers.forEach((trigger) => {
      const videoContent = trigger.nextElementSibling.innerHTML;
      trigger.addEventListener("click", () => {
        trigger.parentElement.innerHTML = videoContent;
        this.youtubeVideos = this.querySelectorAll(".video--youtube");
      });
    });
  }

  triggerModal(e) {
    this.lightBoxGallery.showModal();
    document.body.classList.add("fixed", "w-full");

    const slideIndex = parseInt(
      e.currentTarget?.getAttribute("data-slide-index")
    );

    this.lightboxSwiper.swiper.slideToLoop(slideIndex, 0);
  }
}
