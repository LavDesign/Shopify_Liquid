<template>
  <div class="max-w-[325px] flex flex-col">
    <h3 class="mb-10" v-text="props.settings.empty_cart_header" />
    <template v-for="(cta, i) in props.settings.links" :key="`cta-${i}`">
      <a
        class="ra-button ra-button ra-button--secondary ra-button--lg mb-2"
        :href="cta.url"
      >
        {{ cta.title }}
      </a>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  settings: {
    type: Object,
    default: () => {},
  },
});
</script>
