import { itemList, selectedOptions } from "./utilities";

export function dataViewCart(cart) {
  if (!cart.value.items) return false;
  const items = Array.from(cart.value.items).map((line_item) => {
    const optionsWithValues = Array.from(line_item.options_with_values);
    const currentOptions = optionsWithValues.reduce(
      (option, { name, value }) => {
        option[name.toLowerCase()] = value.toLowerCase();
        return option;
      },
      {}
    );

    return {
      item_id: line_item.id,
      shopify_product_id: line_item.product_id,
      shopify_variant_id: line_item.variant_id,
      shopify_sku: line_item.sku,
      shopify_handle: line_item.handle,
      shopify_compare_price:
        "variant.value.compare_at_price UNSURE WE CAN ACCESS THIS ON THE CART",
      item_name: line_item.product_title,
      affiliation: Shopify.shop,
      currency: Shopify.currency.active,
      item_brand: line_item.vendor,
      item_category: line_item.product_type,
      item_list_id: 'pageType === "product" ? "product" : handle',
      item_list_name: "product", // unsure what this should be specifically
      item_variant: line_item.variant_title,
      item_featured_image: line_item.image,
      option_one: line_item.variant_options[0],
      option_two: line_item.variant_options[1],
      option_three: line_item.variant_options[2],
      price: line_item.price / 100,
      quantity: line_item.quantity,
      ...currentOptions,
    };
  });

  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "acn_view_cart",
    ecommerce: {
      currency: Shopify.currency.active,
      value: cart.value.total_price / 100,
      items: items,
    },
  });
}
