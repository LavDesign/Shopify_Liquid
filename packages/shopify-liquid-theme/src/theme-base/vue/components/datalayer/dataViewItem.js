export function dataViewItem(product, variant) {
  const splitPath = window.location.pathname.split("/").slice(1);
  const pageType = splitPath[0];
  const handle = splitPath[1];
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
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "acn_view_item",
    event_id:
      new Date().getTime() + "." + Math.random().toString(36).substring(5),
    ecommerce: {
      currency: Shopify.currency.active,
      value: variant.value.price,
      items: [
        {
          item_id: variant.value.id,
          shopify_product_id: product.id,
          shopify_variant_id: variant.value.id,
          shopify_sku: variant.value.sku,
          shopify_handle: product.handle,
          shopify_compare_price: product.compare_at_price,
          item_name: product.title,
          affiliation: Shopify.shop,
          currency: Shopify.currency.active,
          item_brand: product.vendor,
          item_category: product.type,
          item_list_id: pageType === "product" ? "product" : handle,
          item_list_name: "product", // unsure what this should be specifically
          item_variant: product.has_only_default_variant
            ? product.title
            : variant.value.title,
          price: variant.value.price,
          ...optionsObject,
        },
      ],
    },
  });
}
