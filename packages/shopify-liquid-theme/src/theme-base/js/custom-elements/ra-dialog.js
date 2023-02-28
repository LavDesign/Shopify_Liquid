(function () {
  const modalToggleButtons = document.querySelectorAll('[id*="modal-"]');
  // handle modal toggle
  const toggleModal = (buttonId) => {
    const dialogElement = document.querySelector(
      `dialog[data-dialog-id="${buttonId}"]`
    );
    if (dialogElement === null || dialogElement === undefined) return;
    dialogElement.showModal();
  };
  // attach event listener to modal toggle buttons
  if (modalToggleButtons !== null && modalToggleButtons !== undefined) {
    modalToggleButtons.forEach((modalToggleBtn) => {
      modalToggleBtn.addEventListener("click", () => {
        const buttonId = modalToggleBtn.getAttribute("id");
        if (buttonId === null || buttonId === undefined) return;
        toggleModal(buttonId);
      });
    });
  }
})();
