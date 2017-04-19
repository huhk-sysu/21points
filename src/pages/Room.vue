<template>
  <div class="container">
    <h1 class="title">21点</h1>
    <el-button @click='ready()' type="primary" size="large">准备好</el-button>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
    }
  },
  methods: {
    ready: function () {
      this.$router.push('Play')
    }
  }
}
</script>


<style scoped>
.title {

}

.container {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
}
</style>
