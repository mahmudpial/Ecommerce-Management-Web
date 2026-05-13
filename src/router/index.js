import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// import views (you need to create these files in the views folder)
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

// route guard: For protected routes, check if the user is authenticated before allowing access
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
