<template>
  <div class="bg-grey-100 mb-[16px] p-[16px] flex flex-col">
    <label>
      <input type="checkbox" name="gift_message" v-model="giftMessage.active" />
      Add a gift message to your order?
    </label>
    <textarea
      v-if="giftMessage.active"
      v-model="giftMessage.message"
      class="ra-textarea__control mt-[16px] border border-grey-300"
      rows="4"
      placeholder="Gift Message Text"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
const giftMessage = ref({ active: false, message: "" });
</script>
