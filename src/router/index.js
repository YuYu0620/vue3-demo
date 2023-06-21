import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../view/HomeView.vue'
import AboutView from '../view/AboutView.vue'
import RoomsList from "../view/roomList.vue"

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: "/home"
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chat',
      name: 'chat',
      component: AboutView
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
