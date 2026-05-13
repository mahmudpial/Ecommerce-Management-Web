import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// ভিউগুলো ইম্পোর্ট করুন (আপনাকে এই ফাইলগুলো views ফোল্ডারে তৈরি করতে হবে)
const routes = [
  { path: '/', component: () => import('../views/Home.vue'), name: 'Home' },
  { path: '/login', component: () => import('../views/Login.vue'), name: 'Login' },
  {
    path: '/dashboard',
    component: () => import('../views/Dashboard.vue'),
    name: 'Dashboard',
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// রাউট গার্ড: প্রটেক্টেড পেজ চেক করা
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
