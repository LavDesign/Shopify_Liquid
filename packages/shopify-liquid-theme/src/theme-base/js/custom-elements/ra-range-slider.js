import noUiSlider from "nouislider";
import 'nouislider/dist/nouislider.css';

export default class RaRangeSlider extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const slider = this.querySelector(".ra-slider");
    const min = parseInt(this.getAttribute("data-min"));
    const max = parseInt(this.getAttribute("data-max"));
    const minStart = parseInt(this.getAttribute("data-min-start"));
    const maxStart = parseInt(this.getAttribute("data-max-start"));

    const minInput = this.querySelector("#PriceMin");
    const maxInput = this.querySelector("#PriceMax");

    noUiSlider.create(slider, {
      start: [minStart, maxStart],
      connect: true,
      range: {min, max}
    });

    slider.noUiSlider.on("change", (values) => {
      minInput.value = parseInt(values[0]);
      maxInput.value = parseInt(values[1]);

      document.getElementById("CollectionFilters").dispatchEvent(new Event("change"));
    });
  }
}
