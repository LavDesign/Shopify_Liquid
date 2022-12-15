import { createApp } from "vue";
import { createPinia } from "pinia";

import { getSizedImageFromUrl } from "../vue/filters/image.js";
import { ucfirst, upcase, unhandleize } from "../vue/filters/string.js";
import { money, moneyWithoutDecimals } from "../vue/filters/money.js";

import components from "../vue/components/index.js";
import RaAccordion from "../js/custom-elements/accordion.js";

//
// mounts web components (custom elements)
//
customElements.define("ra-accordion", RaAccordion);

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

window.addEventListener("load", () => {
  renderVueApps();
});
