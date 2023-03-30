(function () {
  const modalToggleButtons = document.querySelectorAll('[id*="modal-"]');
  const toggleModal = (buttonId) => {
    const dialogElement = document.querySelector(
      `dialog[data-dialog-id="${buttonId}"]`
    );
    if (dialogElement === null || dialogElement === undefined) return;
    dialogElement.showModal();
  };

  if (modalToggleButtons?.length) {
    modalToggleButtons.forEach((modalToggleBtn) => {
      modalToggleBtn.addEventListener("click", () => {
        const buttonId = modalToggleBtn.getAttribute("id");
        if (!buttonId) return;
        toggleModal(buttonId);
      });
    });
  }
})();
