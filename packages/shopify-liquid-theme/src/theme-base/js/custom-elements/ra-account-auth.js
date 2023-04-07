export default class RaAccount extends HTMLElement {
  constructor() {
    super();
    this.accountToggles = this.querySelectorAll("[data-toggle-account]");
    this.accountForms = this.querySelectorAll("form");
  }

  connectedCallback() {
    this.accountToggles.forEach((toggle) => {
      toggle.addEventListener("click", this.accountModalToggle.bind(this));
    });
    this.accountForms.forEach((form) => {
      const button = form.querySelector("button");
      button.addEventListener("click", this.validateForm.bind(this));
    });
  }

  accountModalToggle(e) {
    const { target } = e;
    e.preventDefault();
    Array.from(this.children).forEach((c) => {
      if (c.getAttribute("id") == target.dataset.toggleAccount) {
        c.classList.remove("hidden");
      } else {
        c.classList.add("hidden");
      }
    });
  }

  validateForm(e) {
    const form = e.target.closest("form");
    const requiredInputs = form.querySelectorAll("[data-required]");
    let invalidInputs = [];
    requiredInputs.forEach((input) => {
      if (input.value.length == 0) {
        input.classList.add("border-red");
        invalidInputs.push(input.getAttribute("name"));
      } else {
        input.classList.remove("border-red");
      }
    });
    if (invalidInputs.length > 0) e.preventDefault();
  }
}
