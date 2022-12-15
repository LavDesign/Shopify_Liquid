<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
};
</script>

<template>
  <button class="button-counter" @click="count++">
    You clicked me {{ count }} times.
  </button>
</template>

<style scoped lang="scss">
.button-counter {
  @include foo;
}
</style>
