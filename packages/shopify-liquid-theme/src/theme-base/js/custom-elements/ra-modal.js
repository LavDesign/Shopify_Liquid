import dialogPolyfill from "dialog-polyfill";

export default class RaModal extends HTMLElement {
  constructor() {
    super();
    this.modalToggleButtons = document.querySelectorAll(
      `[id*='${this.getAttribute("dialog-id")}']`
    );
    this.dialog = this.querySelector("dialog");
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
  }

  toggleModal = () => {
    if (this.dialog === null || this.dialog === undefined) return;
    this.dialog.showModal();
  };
}
