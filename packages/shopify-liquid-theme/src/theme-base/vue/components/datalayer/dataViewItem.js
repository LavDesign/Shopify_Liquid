<<<<<<< HEAD
import { itemList, selectedOptions } from "./utilities";
console.log("test");
=======
import { itemList, featuredVariantImage } from "./utilities";
>>>>>>> 4d8dba3332bc1bb33af181c7d72759e702c1b657

export function dataViewItem(product, variant) {
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
          item_featured_image: featuredVariantImage(product, variant.value),
          shopify_product_id: product.id,
          shopify_variant_id: variant.value.id,
          shopify_sku: variant.value.sku,
          shopify_handle: product.handle,
          shopify_compare_price: product.compare_at_price,
          item_name: product.title,
          affiliation: window.shop_name,
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
