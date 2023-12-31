import dialogPolyfill from "dialog-polyfill";

export default class RaModal extends HTMLElement {
  constructor() {
    super();
    this.modalToggleButtons = document.querySelectorAll(
      `[id*='${this.getAttribute("dialog-id")}']`
    );
    this.dialog = this.querySelector("dialog");
    this.modalCloseButton = this.querySelector("[data-modal-close]");
    this.modalCloseButtons = this.querySelectorAll("[data-modal-close]");
  }

  connectedCallback() {
    dialogPolyfill.registerDialog(this.dialog);
    if (this.modalToggleButtons?.length) {
      this.modalToggleButtons.forEach((modalToggleBtn) => {
        modalToggleBtn.addEventListener("click", () => {
          const buttonId = modalToggleBtn.getAttribute("id");
          if (!buttonId) return;
          this.toggleModal();
        });
      });
    }

    this.dialog.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() == "dialog") {
        this.dialog.close();
      }
    });

    if (this.modalCloseButtons.length > 0) {
      this.modalCloseButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          this.dialog.close();
        });
      });
    }
  }

  toggleModal = () => {
    if (this.dialog === null || this.dialog === undefined) return;
    this.dialog.showModal();
  };
}
