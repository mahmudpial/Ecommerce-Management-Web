import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Products from '../views/Products.vue'
import ProductDetails from '../views/ProductDetails.vue'
import Cart from '../views/Cart.vue'

// import views (you need to create these files in the views folder)
const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/register', component: Register, name: 'Register' },

  {
    path: '/products',
    component: Products,
    name: 'Products',
  },
  {
    path: '/product/:id',
    component: ProductDetails,
    name: 'ProductDetails',
    props: true,
  },
  {
    path: '/cart',
    component: Cart,
    name: 'cart',
  },
  {
    path: '/checkout',
    component: () => import('../views/Checkout.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/order-success',
    component: () => import('../views/OrderSuccess.vue'),
    name: 'OrderSuccess',
    meta: { requiresAuth: true },
  },
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
    // লগইন পেজে পাঠান এবং ফিরে আসার পথ মনে রাখুন
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    // লগইন থাকলে লগইন/রেজিস্টার পেজে যেতে দেবেন না
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
