import Vue from 'vue'
import Router from 'vue-router'
import Room from '../pages/Room'
import Result from '../pages/Result'
import Play from '../pages/Play'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/room'
    },
    {
      path: '/room',
      name: 'Room',
      component: Room
    },
    {
      path: '/play',
      name: 'Play',
      component: Play
    }
  ]
})
