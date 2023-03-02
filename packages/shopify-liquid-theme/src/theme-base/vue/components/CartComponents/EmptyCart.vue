<template>
  <div class="max-w-[325px] flex flex-col">
    <h3 class="mb-10">{{ header }}</h3>
    <template v-for="(cta, i) in ctas" :key="`cta-${i}`">
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
import { computed } from "vue";

const props = defineProps({
  settings: {
    type: Object,
    default: () => {},
  },
});

const settings = computed(() => props.settings);

const header = computed(() => settings.value.empty_cart_header);

const ctas = computed(() => settings.value?.links);
</script>
