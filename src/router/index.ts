// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',            // Root path
    name: 'Root',
    // No child views—App.vue is your single-page container
    // You could lazy-load App if you really wanted, but it's already mounted.
    component: () => import('@/App.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
