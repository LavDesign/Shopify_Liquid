export default class RaScrollable extends HTMLElement {
  constructor() {
    super();
    this.elements = this.querySelectorAll(".ra-scrollable");
    this.toggleScrollable = this.toggleScrollable.bind(this);
  }

  connectedCallback() {
    this.elements.forEach((el) => {
      let button = el.querySelector(".ra-scrollable__expand");
      if (button) {
        button.addEventListener("click", () => this.toggleScrollable(el));
      }
    });
  }

  toggleScrollable(el) {
    el.classList.toggle("ra-scrollable--expanded");
  }
}
