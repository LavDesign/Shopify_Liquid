const validateEmail = (email) => {
  const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailTest.test(email);
  return isValid;
};

const validateForm = (e) => {
  const form = e.target.closest("form");
  const requiredInputs = form.querySelectorAll("[data-required]");
  const invalidInputs = Array.from(requiredInputs).filter((input) => {
    const isEmpty = input.value.length === 0;
    const isInvalidEmail =
      input.getAttribute("type") == "email" && !validateEmail(input.value);
    if (isEmpty || isInvalidEmail) {
      input.classList.add("border-red");
      return true;
    } else {
      input.classList.remove("border-red");
      return false;
    }
  });
  if (invalidInputs.length > 0) e.preventDefault();
};

export { validateEmail, validateForm };
