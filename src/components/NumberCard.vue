<template>
  
  <img :src="`https://dummyimage.com/100x50/ddd/f00.jpg&text=${text}`" alt="text" class="card">
  
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
      if (this.value === 0) {
        return 'X'
      }
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
