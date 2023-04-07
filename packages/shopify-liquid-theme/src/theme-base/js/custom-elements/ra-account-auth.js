import { validateForm } from "../utils/account-utils";

export default class RaAccountAuth extends HTMLElement {
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
      button.addEventListener("click", validateForm.bind(this));
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
}
