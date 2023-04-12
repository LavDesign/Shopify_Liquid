import { validateForm } from "../utils/account-utils";

export default class RaAccountAuth extends HTMLElement {
  constructor() {
    super();
    this.accountToggles = this.querySelectorAll("[data-toggle-account]");
    this.accountForms = this.querySelectorAll("form");
    this.passwordResetText = this.querySelector(
      "[data-password-reset-success]"
    );
  }

  connectedCallback() {
    this.accountToggles.forEach((toggle) => {
      toggle.addEventListener("click", this.accountModalToggle.bind(this));
    });
    this.accountForms.forEach((form) => {
      const button = form.querySelector("button");
      button.addEventListener("click", validateForm.bind(this));
    });
    if (window.location.search.includes("password_reset_success")) {
      this.passwordResetText.classList.remove("hidden");
    }
  }

  accountModalToggle(e) {
    e.preventDefault();
    Array.from(this.children).forEach((c) => {
      if (c.dataset.accountContainer === e.target.dataset.toggleAccount) {
        c.classList.remove("hidden");
      } else {
        c.classList.add("hidden");
      }
    });
  }
}
