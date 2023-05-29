import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../view/HomeView.vue'
import AboutView from '../view/AboutView.vue'

const router = [
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
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: AboutView
  }
]

export default new createRouter({
  history: createWebHashHistory(),
  routes: router
})
