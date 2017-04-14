<template>
  <div>

    <!--<h1>{{player}}</h1>-->
  
    <div v-show="player === 'blue' && playing">
      <h2>对手</h2>
      <div>
        <number-card v-for="card in redCards" :value="card" :key="card"></number-card>
        <div>总和: X + {{redSum}}</div>
      </div>
      <hr>
      <div>
        <number-card v-for="card in blueCards" :value="card" :key="card"></number-card>
        <div>总和: {{blueSum}}</div>
      </div>
      <h2>你</h2>
    </div>

    <div v-show="player === 'red' && playing">
      <h2>对手</h2>
      <div>
        <number-card v-for="card in blueCards" :value="card" :key="card"></number-card>
        <div>总和: X + {{blueSum}}</div>
      </div>
      <hr>
      <div>
        <number-card v-for="card in redCards" :value="card" :key="card"></number-card>
        <div>总和: {{redSum}}</div>
      </div>
      <h2>你</h2>
    </div>

    <div class="buttons"  v-show="playing">
      <el-button type="primary" @click='clickGetCardButton()' :disabled='!canGetCard || !turn || boom'>摸牌</el-button>
      <el-button type="warning" @click='clickStopButton()' :disabled='!canGetCard || !turn'>放弃</el-button>
    </div>

    <h2 v-show="!playing || !turn">请等待……</h2>

    <div class="readme">
      <el-collapse :value="[1]">
        <el-collapse-item title="游戏说明" name="1">
          <div>游戏中共有11张牌，点数分别为1到11。</div>
          <div>2名玩家轮流进行回合，在一个玩家的回合内，他可以选择摸牌或者放弃，一旦放弃则以后都不能再摸牌。</div>
          <div>当玩家手中的牌点数大于21点时，将不能再摸牌（称为“爆牌”）。</div>
          <div>当两名玩家都停止抽牌后，比较两人手中牌的点数之和。若双方都没爆牌或都已爆牌，则点数最接近21点者获胜，否则，未爆牌的玩家获胜。</div>
        </el-collapse-item>
      </el-collapse>
    </div>
    
  </div>
</template>

<script>
import numberCard from '../components/NumberCard'

export default {
  name: 'hello',
  data () {
    return {
      player: '',
      blueCards: [],
      redCards: [],
      canGetCard: true,
      turn: false,
      playing: false,
      boom: false,
      errorMsg: null
    }
  },
  sockets: {
    player: function (player) {
      console.log('emit: player')
      this.player = player
      if (this.player === 'blue') {
        this.$message('请等待另一名玩家进入后即可开始游戏！')
      }
    },
    hasError: function ({ msg }) {
      this.$message.error(msg)
      this.$router.push('Room')
    },
    initCards: function ({ blueCards, redCards }) {
      console.log('emit: initCards')
      this.blueCards = blueCards
      this.redCards = redCards
      this.playing = this.canGetCard = true
    },
    newCard: function ({ player, newCard }) {
      console.log('emit: newCard')
      this[player + 'Cards'].push(newCard)
      if (this.canGetCard && this[this.player + 'Sum'] > 21) {
        this.boom = true
      }
    },
    turn: function () {
      this.turn = true
    },
    finish: function ({status, blueCards, redCards}) {
      console.log('emit: finish')
      console.log(status)
      this.blueCards = blueCards
      this.redCards = redCards
      let msg
      if (status === 'draw') {
        msg = '平局！'
      } else if (status === this.player) {
        msg = '你赢了！'
      } else {
        msg = '你输了！'
      }
      this.$alert(msg, '游戏结果', {
        confirmButtonText: '确定',
        callback: () => {
          this.$router.push('Room')
        }
      })
    }
  },
  components: {
    numberCard
  },
  methods: {
    clickGetCardButton: function () {
      this.$socket.emit('getCard', this.player)
      this.turn = false
    },
    clickStopButton: function () {
      this.$confirm('放弃后将不能再摸牌, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$socket.emit('stop', this.player)
        this.canGetCard = false
      })
    }
  },
  computed: {
    blueSum: function () {
      return this.blueCards.reduce((prev, cur) => prev + cur, 0)
    },
    redSum: function () {
      return this.redCards.reduce((prev, cur) => prev + cur, 0)
    }
  }
}
</script>


<style scoped>
.readme {
  margin: 0 auto;
  width: 500px;
  margin-top: 20px;
  text-align: left;
}
</style>
