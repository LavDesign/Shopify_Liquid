export function viewItem(product, variant) {
  window.dataLayer = window.dataLayer || [];

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

  dataLayer.push({
    event: "acn_view_item",
    event_id:
      new Date().getTime() + "." + Math.random().toString(36).substring(5),
    ecommerce: {
      currencyCode: Shopify.currency.active,
      detail: {
        products: [
          {
            id: variant.value.id,
            sku: variant.value.sku,
            handle: product.handle,
            productId: product.id,
            variantId: variant.value.id,
            name: product.title,
            price: variant.value.price,
            brand: product.vendor,
            variant: variant.value.title,
            category: product.type,
          },
        ],
      },
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
