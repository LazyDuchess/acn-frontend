import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/me',
      name: 'about',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/mod/users',
      name: 'manageusers',
      component: () => import('../views/ManageUsersView.vue'),
    },
  ],
})

export default router
