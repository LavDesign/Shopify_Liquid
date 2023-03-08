const getSearchParamsFromForm = (form) => {
  const formData = new FormData(form);
  return new URLSearchParams(formData).toString();
};

const updateURL = (searchParams) => {
  if (searchParams.length > 0) {
    history.pushState(
      { searchParams },
      "",
      `${window.location.pathname}${searchParams && "?".concat(searchParams)}`
    );
  }
};

export { getSearchParamsFromForm, updateURL };
