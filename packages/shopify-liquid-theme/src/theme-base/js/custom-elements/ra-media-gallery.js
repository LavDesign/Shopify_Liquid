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
    this.thumbSwiper = this.querySelector(
      ".ra-gallery-carousel__thumbnails swiper-container"
    );
    this.lightBoxSwiper = this.querySelector(
      ".ra-gallery-carousel__lightbox swiper-container"
    );

    this.youtubeVideos = this.querySelectorAll(".video--youtube");

    this.loadVideoTriggers = this.querySelectorAll("[data-action-load-video]");
    this.setupEventListeners();

    const scopedThis = this;
    this.primarySwiper?.addEventListener("update", () => {
      window.setTimeout(function () {
        scopedThis.primarySwiper.swiper.slideToLoop(1, 100);
      }, 100);
    });
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
    const scopedThis = this;
    if (this.lightBoxTriggers.length) {
      this.lightBoxTriggers.forEach((trigger) =>
        trigger.addEventListener("click", (e) => this.triggerModal(e))
      );
    }

    this.lightBoxGallery?.addEventListener("reachend", () => {
      // A hacky way to ensure that the proper lightbox slide is shown on primary slide click after a loop
      // Default swiper attributes/methods realIndex and slideToLoop don't account for the a11y span and
      // indexes are off when a11y are disabled
      const spanToRemove = document.querySelector(
        ".swiper--lightbox .swiper-notification"
      );

      if (spanToRemove) {
        spanToRemove.remove();
      }
    });

    this.lightBoxGallery?.addEventListener("click", (e) => {
      // if the dialog backdrop pseudoelement is clicked, close the dialog
      if (e.target === this.lightBoxGallery) {
        this.lightBoxGallery.close();
      }
    });

    this.lightBoxGallery?.addEventListener("close", () => {
      this.pauseGalleryVideos();
      document.body.classList.remove("fixed", "w-full");
    });

    this.primarySwiper?.addEventListener("slidechange", () => {
      let currentSlide = null;
      let scopedThis = this;
      this.thumbSwiper.querySelectorAll("swiper-slide").forEach((slide) => {
        slide.style.border = "2px solid transparent";
      });
      const totalSlides = this.primarySwiper.childNodes.length;

      window.setTimeout(function () {
        let currentSlide = parseInt(
          scopedThis.primarySwiper
            .querySelector("swiper-slide.swiper-slide-active")
            .getAttribute("data-slide-index")
        );
        if (currentSlide > totalSlides) {
          currentSlide = 0;
        }
        scopedThis.thumbSwiper.querySelector(
          `swiper-slide[data-slide-index='${currentSlide}']`
        ).style.border = "2px solid black";
      }, 400);
      this.pauseGalleryVideos(currentSlide);
    });

    this.lightBoxSwiper?.addEventListener("slidechange", () => {
      this.pauseGalleryVideos();
    });

    this.primarySwiper?.addEventListener("beforeinit", () => {
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

    this.thumbSwiper.querySelectorAll("swiper-slide").forEach((thumb) => {
      thumb.addEventListener("click", function () {
        let thumbIndex = parseInt(thumb.getAttribute("data-slide-index"));
        scopedThis.primarySwiper.swiper.slideToLoop(thumbIndex, 200);
      });
    });
  }

  triggerModal(event) {
    this.lightBoxGallery.showModal();
    document.body.classList.add("fixed", "w-full");
    this.lightBoxSwiper.swiper.init();

    if (this.primarySwiper) {
      const slideIndex = this.primarySwiper.swiper.realIndex;
      this.lightBoxSwiper.swiper.slideToLoop(slideIndex, 0);
      this.thumbSwiper.swiper.slideToLoop(slideIndex, 0);
    } else {
      let galleryIndex = parseInt(event.srcElement.dataset.slideIndex);
      const slideIndex = galleryIndex;
      this.lightBoxSwiper.swiper.slideToLoop(slideIndex, 0);
    }
  }
}
