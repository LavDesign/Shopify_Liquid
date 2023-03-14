const refreshReviewWidgets = () => {
  if (window.yotpoWidgetsContainer) {
    window.yotpoWidgetsContainer.initWidgets();
  }
};

export { refreshReviewWidgets };
