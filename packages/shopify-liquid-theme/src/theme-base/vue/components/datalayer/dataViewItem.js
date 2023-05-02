import { itemList, selectedOptions } from "./utilities";
console.log("test");

export function dataViewItem(product, variant) {
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
          item_variant: product.has_only_default_variant
            ? product.title
            : variant.value.title,
          price: variant.value.price,
          ...selectedOptions(product, variant),
          ...itemList(product, variant),
        },
      ],
    },
  });
}
