const refreshReviewWidgets = () => {
  if (window.yotpoWidgetsContainer) {
    window.yotpoWidgetsContainer.initWidgets();
    window.yotpo.refreshWidgets();
  }
};

export { refreshReviewWidgets };
