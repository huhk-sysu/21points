<template>
  <div class="container">
    <h1 class="title">21点</h1>
    <el-button @click="ready('room1')" type="primary" size="large">房间1</el-button>
    <el-button @click="ready('room2')" type="primary" size="large">房间2</el-button>
  </div>
</template>

<script>
export default {
  name: 'Room',
  data () {
    return {
    }
  },
  methods: {
    ready: function (room) {
      this.$router.push('Play')
      this.$socket.emit('ready', room)
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
