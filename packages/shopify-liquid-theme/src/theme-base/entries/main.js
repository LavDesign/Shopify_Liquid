import { createApp } from "vue";
import { createPinia } from "pinia";

import { getSizedImageFromUrl } from "../vue/filters/image.js";
import { ucfirst, upcase, unhandleize } from "../vue/filters/string.js";
import { money, moneyWithoutDecimals } from "../vue/filters/money.js";

import Swiper from "swiper/bundle";
import { register } from "swiper/element/bundle";
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

const isDesignMode = window.Shopify.designMode || window.Shopify.inspectMode;
const pinia = createPinia();

/**
 * renderVueApps
 * @param {String} eventTarget - string selector for vue app roots.
 */
const renderVueApps = (eventTarget = '[data-vue-root]') => {
  const vueRoots = document.querySelectorAll(eventTarget);
  vueRoots.forEach((root) => {
    const app = createApp();
    const componentName = root.dataset.vueRoot;
    const component = components[componentName];

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
    if (isDesignMode) {
      const appSectionLoad = (event) => {
        const parentSectionId = `#shopify-section-${event.detail.sectionId}`;
        if (root.closest(parentSectionId) !== null) {
          app.unmount();
          document.removeEventListener('shopify:section:load', appSectionLoad);
        }
      };
      document.addEventListener('shopify:section:load', appSectionLoad);
    }
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
  register();
});

/**
 * Customizer Refresh Apps Code
 */
if (isDesignMode) {
  window.renderVueApps = renderVueApps;
  const refreshVue = (event) => {
    if (event?.detail?.sectionId) {
      renderVueApps(
        `#shopify-section-${event.detail.sectionId} [data-vue-root]`,
        isDesignMode
      );
    }
  };
  document.addEventListener('shopify:section:load', refreshVue);
  document.addEventListener('shopify:section:deselect', refreshVue);
  document.addEventListener('shopify:section:reorder', refreshVue);
}
