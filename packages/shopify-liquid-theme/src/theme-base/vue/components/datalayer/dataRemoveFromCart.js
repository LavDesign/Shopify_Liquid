import { itemList } from "./utilities";

export function dataRemoveFromCart(line_item) {
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "acn_remove_from_cart",
    event_id:
      new Date().getTime() + "." + Math.random().toString(36).substring(5),
    ecommerce: {
      currency: Shopify.currency.active,
      value: line_item.price / 100,
      items: [
        {
          item_id: line_item.id,
          shopify_product_id: line_item.product_id,
          shopify_variant_id: line_item.variant_id,
          shopify_sku: line_item.sku,
          shopify_handle: line_item.handle,
          shopify_compare_price: "variant.value.compare_at_price",
          item_name: line_item.product_title,
          affiliation: Shopify.shop,
          currency: Shopify.currency.active,
          item_brand: line_item.vendor,
          item_category: line_item.product_type,
          item_variant: line_item.variant_title,
          item_featured_image: line_item.image,
          option_one: line_item.option1,
          option_two: line_item.option2,
          option_three: line_item.option3,
          price: line_item.price / 100,
          quantity: 0,
          ...itemList(line_item),
        },
      ],
    },
  });
}
