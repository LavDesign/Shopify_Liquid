const productRecommendationsSection = document.querySelector(
  ".product-recommendations"
);
const handleIntersection = (entries, observer) => {
  if (!entries[0].isIntersecting) return;

  observer.unobserve(productRecommendationsSection);

  const url = productRecommendationsSection.dataset.url;

  fetch(url)
    .then((response) => response.text())
    .then((text) => {
      const html = document.createElement("div");
      html.innerHTML = text;
      const recommendations = html.querySelector(".product-recommendations");

      if (recommendations && recommendations.innerHTML.trim().length) {
        productRecommendationsSection.innerHTML = recommendations.innerHTML;
      }
    })
    .catch((e) => {
      console.error(e);
    });
};

if (productRecommendationsSection) {
  const observer = new IntersectionObserver(handleIntersection, {
    rootMargin: "0px 0px 200px 0px",
  });

  observer.observe(productRecommendationsSection);

  fetch(
    window.location.origin +
      window.Shopify.routes.root +
      productRecommendationsSection.getAttribute("data-url")
  ).then((response) => response.text());
}
