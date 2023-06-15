export const money = (val) => {
  val = val / 100;
  const locale_root = window.shopify_locale_current;
  const currency_code = window.shopify_currency_code;
  const default_currency_code = window.shopify_currency_default;
  if (default_currency_code != currency_code) {
    val = new Intl.NumberFormat(locale_root.split("/").pop(), {
      style: "currency",
      currency: currency_code,
    }).format(val);
    return val;
  } else {
    let str = String(parseFloat(val) / 100);
    str += str.indexOf(".") < 0 ? ".00" : "00";
    return `$${str.substring(0, str.indexOf(".") + 3)}`;
  }
};

export const moneyWithoutDecimals = (val) => {
  return money(val).replace(/\.00/g, "");
};
