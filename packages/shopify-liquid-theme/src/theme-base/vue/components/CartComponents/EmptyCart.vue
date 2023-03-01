<template>
  <div class="max-w-[325px] flex flex-col">
    <h3 class="mb-10">{{ header }}</h3>
    <template v-for="(cta, i) in ctas" :key="`cta-${i}`">
      <a
        class="ra-button ra-button ra-button--secondary ra-button--lg mb-2"
        :href="cta.empty_cart_cta_link"
      >
        {{ cta.empty_cart_cta_text }}
      </a>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  settings: {
    type: Object,
    default: () => {},
  },
});

const settings = computed(() => props.settings);

const header = computed(() => settings.value.empty_cart_header);

const ctas = computed(() => {
  const cta_keys =
    "enable_empty_cart_cta,empty_cart_cta_text,empty_cart_cta_link".split(",");
  const ctaArray = [];

  [1, 2, 3].forEach((i) => {
    const tempObject = {};
    cta_keys.forEach((key) => {
      const tempKey = key + "_" + i;
      if (tempKey && settings.value[tempKey]) {
        tempObject[key] = settings.value[tempKey];
      }
    });
    if (Object.keys(tempObject)?.length > 1) ctaArray.push(tempObject);
  });
  return ctaArray;
});
</script>
