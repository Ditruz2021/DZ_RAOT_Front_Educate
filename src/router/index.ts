import { createRouter, createWebHistory } from 'vue-router'
import UserView from '@/views/UserView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/users' },
    { path: '/users', name: 'Users', component: UserView }
  ]
})

export default router
