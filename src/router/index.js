import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../view/HomeView.vue'
import AboutView from '../view/AboutView.vue'

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
      path: '/about',
      name: 'about',
      component: AboutView
    }
  ]
});

router.beforeEach(() => {
  return true;
})

export default router 
