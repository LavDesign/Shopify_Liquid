export function dataAddToCart(product, currentVariant, qty) {
  const splitPath = window.location.pathname.split("/").slice(1);
  const pageType = splitPath[0];
  const handle = splitPath[1];

  dataLayer.push({
    event: "acn_add_to_cart",
    event_id:
      new Date().getTime() + "." + Math.random().toString(36).substring(5),
    currency: Shopify.currency.active,
    value: currentVariant.value.price,
    items: [
      {
        item_id: currentVariant.value.id,
        shopify_product_id: product.id,
        shopify_variant_id: currentVariant.value.id,
        shopify_sku: currentVariant.value.sku,
        shopify_handle: product.handle,
        shopify_compare_price: currentVariant.value.compare_at_price,
        item_name: product.title,
        affiliation: Shopify.shop,
        currency: Shopify.currency.active,
        item_brand: product.vendor,
        item_category: product.type,
        item_list_id: pageType === "product" ? "product" : handle,
        item_list_name: 'product', // unsure what this should be specifically
        item_variant: currentVariant.value.title,
        item_featured_image: currentVariant.value.featured_image,
        option_one: currentVariant.value.option1,
        option_two: currentVariant.value.option2,
        option_three: currentVariant.value.option3,
        price: currentVariant.value.price,
        quantity: qty.value,
      },
    ],
  });
}
