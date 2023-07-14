import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../view/HomeView.vue'
import AboutView from '../view/AboutView.vue'
import RoomsList from "../view/roomList.vue"
import ChartDemo from "../view/chartDemo.vue"
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: "/chartDemo"
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chartDemo',
      name: 'chartDemo',
      component: ChartDemo
    },
    {
      path: '/roomList',
      name: 'roomList',
      component: RoomsList
    }
  ]
});

router.beforeEach(() => {
  return true;
})

export default router 
