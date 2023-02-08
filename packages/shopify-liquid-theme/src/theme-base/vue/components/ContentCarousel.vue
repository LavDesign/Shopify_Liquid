<template>
  <swiper
  :slides-per-view="3"
  :space-between="50">
    <slot></slot>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';

export default {
  name: "ContentCarousel",
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {},
  data() {
    return {
      data: "Test",
    };
  },
  computed: {},
  mounted: {},
};
</script>

<style lang="scss" scoped></style>
