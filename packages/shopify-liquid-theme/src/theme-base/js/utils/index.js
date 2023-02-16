export const refreshReviewWidgets = () => {
  if (window.yotpoWidgetsContainer) {
    window.yotpoWidgetsContainer.initWidgets();
  }
};
