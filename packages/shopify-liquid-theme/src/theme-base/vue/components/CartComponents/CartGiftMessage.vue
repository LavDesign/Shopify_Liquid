<template>
  <div class="bg-grey-100 mb-4 p-4 flex flex-col">
    <div
      class="ra-choice ra-choice ra-choice--checkbox ra-choice--classic ra-choice--checkbox-classic"
    >
      <input
        class="ra-choice__input"
        id="
    gift_message
  "
        type="checkbox"
        v-model="giftMessageActive"
      />
      <label
        class="ra-choice__container set--sibling-deep-focus"
        for="
    gift_message
  "
      >
        <div class="ra-choice__checkmark set--inherit-focus">
          <span
            aria-hidden="true"
            class="ra-choice__checkmark-icon ra-icon ra-icon--sm"
          >
            <svg class="ra-icon ra-icon--xs">
              <use xlink:href="#check"></use>
            </svg>
          </span>
        </div>
        <span class="ra-choice__label">Add a gift message to your order?</span>
      </label>
    </div>
    <textarea
      v-if="giftMessageActive"
      v-model="tempNote"
      class="ra-textarea__control mt-4 border border-grey-300"
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
