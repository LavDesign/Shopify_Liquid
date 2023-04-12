const passwordResetToken = () => {
  const tokenExists = Number(window.localStorage.getItem("pw_request"));
  if (tokenExists === 1 || !tokenExists) {
    window.localStorage.setItem("pw_request", 1);
  }
};

const validateEmail = (email) => {
  const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailTest.test(email);
  return isValid;
};

const validatePasswords = (arr) => {
  return arr.length <= 1 || arr.every((str) => str === arr[0]);
};

const validateForm = (e) => {
  const form = e.target.closest("form");
  const requiredInputs = Array.from(form.querySelectorAll("[data-required]"));
  const passwordInputs = requiredInputs
    .filter(
      (input) =>
        input.getAttribute("type") == "password" && input.value.length > 0
    )
    .map((input) => input.value);
  const passwordsMatch = validatePasswords(passwordInputs);
  const invalidInputs = requiredInputs.filter((input) => {
    const isEmpty = input.value.length === 0;
    const isInvalidEmail =
      input.getAttribute("type") == "email" && !validateEmail(input.value);
    const isPasswordInput = input.getAttribute("type") == "password";
    if (isEmpty || isInvalidEmail || (isPasswordInput && !passwordsMatch)) {
      input.classList.add("border-red");
      return true;
    } else {
      input.classList.remove("border-red");
      return false;
    }
  });
  if (invalidInputs.length > 0) e.preventDefault();
  else if (form.action.includes("/recover")) {
    passwordResetToken();
  }
  return invalidInputs.length === 0;
};

export { validateEmail, validateForm };
