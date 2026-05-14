import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Products from '../views/Products.vue'
import ProductDetails from '../views/ProductDetails.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'

// import views (you need to create these files in the views folder)
const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/login', component: Login, name: 'Login' },

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
    component: Checkout,
    name: 'Checkout',
  },
  {
    path: '/dashboard',
    component: Dashboard,
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
