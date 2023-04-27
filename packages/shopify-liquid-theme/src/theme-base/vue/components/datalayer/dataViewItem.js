import { itemList, selectedOptions } from "./utilities";

export function dataViewItem(product, variant) {
  console.log("Logging Data View");
  console.log(product);
  console.log(variant.value);
  console.log("---------------");

  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "acn_view_item",
    event_id:
      new Date().getTime() + "." + Math.random().toString(36).substring(5),
    ecommerce: {
      currency: Shopify.currency.active,
      value: (variant.value.price / 100).toFixed(2),
      items: [
        {
          item_id: variant.value.id,
          item_featured_image: null,
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
          price: (variant.value.price / 100).toFixed(2),
          option_one: variant.value.option1,
          option_two: variant.value.option2,
          option_three: variant.value.option3,
          quantity: 1,
          ...itemList(product, variant),
        },
      ],
    },
  });
}
