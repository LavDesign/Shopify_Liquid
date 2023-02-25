<template>
  <div class="bg-grey-100 mb-[16px] p-[16px] flex flex-col">
    <label>
      <input type="checkbox" name="gift_message" v-model="giftMessageActive" />
      Add a gift message to your order?
    </label>
    <textarea
      v-if="giftMessageActive"
      v-model="tempNote"
      class="ra-textarea__control mt-[16px] border border-grey-300"
      rows="4"
      placeholder="Gift Message Text"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useCartStore } from "../../stores/cart";

const props = defineProps({
  note: {
    type: String,
    default: "",
  },
  attributes: {
    type: Object,
    default: () => {},
  },
});

const cartStore = useCartStore();
let giftMessageActive = ref(false);
let tempNote = ref("");

const debounce = (fn, wait) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
};

watch(
  tempNote,
  debounce((updatedNote) => {
    cartStore.updateNote(updatedNote);
  }, 500)
);
</script>
