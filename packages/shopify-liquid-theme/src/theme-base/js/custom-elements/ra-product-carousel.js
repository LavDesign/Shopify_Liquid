const productRecommendationsSections = document.querySelectorAll(".product-recommendations");

const handleIntersection = (entries, observer) => {
  const sectionID = entries[0].target.dataset.section;
  const productRecSection = document.querySelector(
    `[data-section='${sectionID}']`
  );
  if (!entries[0].isIntersecting) return;

  observer.unobserve(productRecSection);
  const url = productRecSection.dataset.url;

  fetch(url)
    .then((response) => response.text())
    .then((text) => {
      const html = document.createElement("div");
      html.innerHTML = text;
      const recommendations = html.querySelector(".product-recommendations");

      if (recommendations && recommendations.innerHTML.trim().length) {
        productRecSection.innerHTML = recommendations.innerHTML;
      }
    })
    .catch((e) => {
      console.error(e);
    });
};

productRecommendationsSections.forEach((carousel) => {
  if (carousel) {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "0px 0px 200px 0px",
    });

    observer.observe(carousel);

    fetch(
      window.location.origin +
        window.Shopify.routes.root +
        carousel.getAttribute("data-url")
    ).then((response) => response.text());
  }
});
