<template>
  <div ref="carousel">
    <swiper
      :slides-per-view="2"
      :space-between="20"
      :navigation="navigation"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :breakpoints="breakpoints"
    >
      <slot></slot>
    </swiper>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Swiper, Navigation } from 'swiper/vue';

import "swiper/css";

const props = defineProps({
  options: Object,
});

const carousel = ref(null)

const onSwiper = (swiper) => {
  console.log(swiper);
};
const onSlideChange = () => {
  console.log('slide change');
};

const breakpoints = {
  640: {
    slidesPerView: 2,
    spaceBetween: 15,
  },
  768: {
    slidesPerView: 3,
    spaceBetween: 24,
  },
  1024: {
    slidesPerView: 4,
    spaceBetween: 40,
  },
};

const navigation = {
  nextEl: '.ra-carousel__nav-cta--next',
  prevEl: '.ra-carousel__nav-cta--prev',
}

onMounted(() => {
  const swiperWrapper = carousel.value.querySelector('.swiper-wrapper');
  const slides = carousel.value.querySelectorAll('.swiper-slide');

  slides.forEach((slide) => {
    swiperWrapper.appendChild(slide);
  });
});
</script>

<style lang="scss" scoped></style>
