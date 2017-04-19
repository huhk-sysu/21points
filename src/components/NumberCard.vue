<template>
  
  <img :src="`/static/cards/${text}.jpg`" alt="text" class="card">
  
</template>

<script>
export default {
  name: 'numberCard',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  computed: {
    text: function () {
      return this.value + ''
    }
  }
}
</script>

<style scoped>
.card {
  padding: 10px;
}
</style>
