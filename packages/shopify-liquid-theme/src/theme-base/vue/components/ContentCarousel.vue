<template>
  <div ref="carousel">
    <div class="ra-carousel__nav" :class="`ra-carousel__nav--${options.nav_placement}`">
      <button
        class="ra-button ra-icon-button ra-button--tertiary ra-icon-button--sm ra-icon-button--rounded ra-carousel__nav-cta ra-carousel__nav-cta--prev"
        aria-label="Go to previous slide"
      >
        <svg class="ra-icon ra-icon--sm">
          <use xlink:href="#left-arrow"></use>
        </svg>
      </button>
      <button
        class="ra-button ra-icon-button ra-button--tertiary ra-icon-button--sm ra-icon-button--rounded ra-carousel__nav-cta ra-carousel__nav-cta--next"
        aria-label=" Go to next slide"
      >
        <svg class="ra-icon ra-icon--sm">
          <use xlink:href="#right-arrow"></use>
        </svg>
      </button>
    </div>
    <Swiper
      :slides-per-view="2"
      :space-between="16"
      :breakpoints="breakpoints"
      :navigation="navigation"
    >
      <slot></slot>
    </Swiper>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import SwiperCore, { Navigation } from "swiper";
import { Swiper } from "swiper/vue";

import "swiper/css";

SwiperCore.use([Navigation]);

const props = defineProps({
  options: Object,
});

const carousel = ref(null);

const breakpoints = {
  640: {
    slidesPerView: 2,
    spaceBetween: 15,
  },
  768: {
    slidesPerView: 3,
    spaceBetween: 16,
  },
  1280: {
    slidesPerView: 4,
    spaceBetween: 24,
  },
};

const navigation = {
  nextEl: ".ra-carousel__nav-cta--next",
  prevEl: ".ra-carousel__nav-cta--prev",
};

onMounted(() => {
  const swiperWrapper = carousel.value.querySelector(".swiper-wrapper");
  const slides = carousel.value.querySelectorAll(".swiper-slide");

  slides.forEach((slide) => {
    swiperWrapper.appendChild(slide);
  });
});
</script>

<style lang="scss" scoped></style>
