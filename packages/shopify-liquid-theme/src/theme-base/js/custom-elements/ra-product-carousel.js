const productRecommendationsSections = document.querySelectorAll(
  ".product-recommendations"
);

const productRecommendationsSectionsMobile = document.querySelectorAll(
  ".product-recommendations-mobile"
);

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

const handleIntersectionMobile = (entries, observerMobile) => {
  const sectionID = entries[0].target.dataset.sectionMobile;
  const productRecSection = document.querySelector(
    `[data-section-mobile='${sectionID}']`
  );
  if (!entries[0].isIntersecting) return;

  observerMobile.unobserve(productRecSection);
  const url = productRecSection.dataset.url;

  fetch(url)
    .then((response) => response.text())
    .then((text) => {
      const html = document.createElement("div");
      html.innerHTML = text;
      const recommendations = html.querySelector(
        ".product-recommendations-mobile"
      );

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

productRecommendationsSectionsMobile.forEach((carousel) => {
  if (carousel) {
    const observerMobile = new IntersectionObserver(handleIntersectionMobile, {
      rootMargin: "0px 0px 0px 0px",
    });

    observerMobile.observe(carousel);

    fetch(
      window.location.origin +
        window.Shopify.routes.root +
        carousel.getAttribute("data-url")
    ).then((response) => response.text());
  }
});
