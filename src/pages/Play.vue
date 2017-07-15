<template>
  <div>

    <div v-if="player === 'blue' && playing">
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

    <div v-if="player === 'red' && playing">
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

    <div class="buttons"  v-if="playing">
      <el-button type="primary" @click='clickGetCardButton()' :disabled='!canGetCard || !turn || boom'>摸牌</el-button>
      <el-button type="warning" @click='clickStopButton()' :disabled='!canGetCard || !turn'>放弃</el-button>
    </div>

    <h2 v-if="!playing">请等待对手进入……</h2>
    <h2 v-show="playing && !turn">请等待对手行动……</h2>
    <el-card class="box-card readme">
      <h2>游戏说明</h2>
      <ul>
        <li>游戏中共有11张牌，点数分别为1到11。</li>
        <li>2名玩家轮流进行回合，在一个玩家的回合内，他可以选择摸牌或者放弃，一旦放弃则以后都不能再摸牌。</li>
        <li>当玩家手中的牌点数大于21点时，将不能再摸牌（称为“爆牌”）。</li>
        <li>当两名玩家都停止抽牌后，比较两人手中牌的点数之和。若双方都没爆牌或都已爆牌，则点数最接近21点者获胜，否则，未爆牌的玩家获胜。</li>
      </ul>
    </el-card>    
  </div>
</template>

<script>
import numberCard from '../components/NumberCard'

export default {
  name: 'Play',
  data () {
    return {
      player: '',
      blueCards: [],
      redCards: [],
      canGetCard: true,
      turn: false,
      playing: false,
      errorMsg: null
    }
  },
  computed: {
    blueSum: function () {
      return this.blueCards.reduce((prev, cur) => prev + cur, 0)
    },
    redSum: function () {
      return this.redCards.reduce((prev, cur) => prev + cur, 0)
    },
    boom: function () {
      return this[this.player + 'Sum'] > 21
    },
    opponent: function () {
      return this.player === 'blue' ? 'red' : 'blue'
    }
  },
  sockets: {
    player: function (player) {
      // console.log('emit: player')
      this.player = player
      if (this.player === 'blue') {
        this.$message('请等待另一名玩家进入后即可开始游戏！')
      }
    },
    hasError: function ({ msg }) {
      this.$message.error(msg)
      this.$socket.emit('leave')
      this.$router.push('Room')
    },
    updateCards: function ({ blueCards, redCards }) {
      // console.log('emit: updateCards')
      // console.log(blueCards, redCards)
      if (this.player === 'blue') {
        redCards[0] = 0
      } else {
        blueCards[0] = 0
      }
      this.blueCards = blueCards
      this.redCards = redCards
    },
    begin: function () {
      // console.log('emit: begin')
      this.playing = this.canGetCard = true
    },
    turn: function () {
      this.turn = true
    },
    finish: function ({status, blueCards, redCards}) {
      // console.log('emit: finish')
      // console.log(status)
      this.blueCards = blueCards
      this.redCards = redCards
      let title, msg
      if (status === 'draw') {
        title = '平局！'
      } else if (status === this.player) {
        title = '你赢了！'
      } else {
        title = '你输了！'
      }
      msg = '你的手牌为：' + this[this.player + 'Cards'].join(',') +
            '，总和为' + this[this.player + 'Sum'] +
            '，对方手牌为：' + this[this.opponent + 'Cards'].join(',') +
            '，总和为' + this[this.opponent + 'Sum']
      this.$alert(msg, title, {
        confirmButtonText: '确定',
        callback: () => {
          this.$socket.emit('leave')
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
        this.turn = false
      })
    }
  },
  created: function () {
    // this.$socket.emit('ready')
  }
}
</script>


<style scoped>
.readme {
  margin: 0 auto;
  width: 500px;
  margin-top: 20px;
}

.readme ul {
  text-align: left;
}
</style>
