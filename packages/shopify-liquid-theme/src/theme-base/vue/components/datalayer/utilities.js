export function itemList(product = {}, variant = {}, collection = {}) {
  const splitPath = window.location.pathname.split("/").slice(1);
  const pageType = splitPath[0];
  let item_list_id, item_list_name;
  if (pageType === "products") {
    item_list_id = product?.id;
    item_list_name = "product";
  } else if (pageType === "collections") {
    item_list_id = `${product?.id}_${collection?.id}`;
    item_list_name = "product_collection";
  }

  return {
    item_list_id: item_list_id,
    item_list_name: item_list_name,
  };
}

export function selectedOptions(product = {}, variant = {}) {
  const optionsWithValues = Object.entries(product.options_with_values);
  const currentOptions = optionsWithValues.map(([key, value]) => {
    const selectedValue = variant.value.options
      .filter((o) => {
        if (value.includes(o)) return true;
      })
      .pop();
    return [key.toLowerCase(), selectedValue];
  });
  const optionsObject = Object.fromEntries(currentOptions);
  return optionsObject;
}

export function featuredVariantImage(product, variant) {
  const featuredImage = variant?.images?.default || product?.featured_image;
  let featuredImagePath;
  if (featuredImage) {
    let featuredImageSrc =
      typeof featuredImage == "string"
        ? featuredImage
        : featuredImage.sizes.original ||
          Object.keys(featuredImage.sizes)[0] ||
          null;
    if (featuredImageSrc.includes("/products")) {
      // we get the index of /products so we can make sure we are getting the product image
      // and add 1 to that index to account for the / that we don't need
      const srcIndex = featuredImageSrc.indexOf("/products");
      featuredImagePath = featuredImageSrc.substring(srcIndex + 1);
      if (featuredImagePath.includes("?")) {
        featuredImagePath = featuredImagePath.split("?").shift();
      }
    }
  }
  return featuredImagePath;
}
