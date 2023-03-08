import { createApp } from "vue";
import { createPinia } from "pinia";

import { getSizedImageFromUrl } from "../vue/filters/image.js";
import { ucfirst, upcase, unhandleize } from "../vue/filters/string.js";
import { money, moneyWithoutDecimals } from "../vue/filters/money.js";

// import Swiper from "swiper/bundle";
import Swiper from "swiper/bundle";
// import Swiper from "swiper/swiper-bundle.esm.browser";
// import $ from "expose-loader?exposes=$,jQuery!jquery";
// import { register } from "swiper/element/bundle";

import "swiper/css/bundle";

import components from "../vue/components/index.js";
import "../js/custom-elements/custom-elements.js";
import "../js/custom-elements/ra-dialog.js";
import "../js/custom-elements/scrollable.js";

import "@bva/ui-shared/styles/reset.css";
import "@bva/ui-shared/styles/required.css";
import "@bva/ui-shared/styles/components.css";
import "tailwindcss/utilities.css";
import "../scss/main.scss";

const pinia = createPinia();

const renderVueApps = () => {
  const vueRoots = document.querySelectorAll("[data-vue-root]");
  vueRoots.forEach((root) => {
    const app = createApp();
    const componentName = root.dataset.vueRoot;
    const component = components[root.dataset.vueRoot];

    app.component(componentName, component);
    app.config.globalProperties.$filters = {
      getSizedImageFromUrl,
      ucfirst,
      upcase,
      unhandleize,
      money,
      moneyWithoutDecimals,
    };
    app.use(pinia);
    app.mount(root);
  });
};

const initSwipers = () => {
  const swipers = document.querySelectorAll(".swiper");
  if (!swipers) return;

  swipers.forEach((swiperEle) => {
    const swiperData = swiperEle.getAttribute("data-swiper-settings");
    if (!swiperData) return;
    new Swiper(swiperEle, JSON.parse(swiperData));
  });

  // Shop the look - slideTo product slides
  document.addEventListener("swiper:slideTo", function (event) {
    if (!event.detail.swiper || !event.detail.slideTo) return;
    const swiperEle = event.detail.swiper;
    const slideIndex = parseInt(event.detail.slideTo);
    const swiper = new Swiper(swiperEle);
    swiper.translateTo(0, 500, false, false);
    swiper.slideTo(slideIndex, 500, false);
  });
};

window.addEventListener("load", () => {
  renderVueApps();
  initSwipers();
  // register();
});
