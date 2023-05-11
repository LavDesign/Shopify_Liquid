import { defineStore } from "pinia";
import { ref } from "vue";
import { updateURL } from "../../js/utils/search-params";

export const useProductPageStore = defineStore("productPage", () => {
  const currentVariant = ref();

  const setCurrentVariant = (variant) => {
    currentVariant.value = variant;
  };

  return { currentVariant, setCurrentVariant };
});
