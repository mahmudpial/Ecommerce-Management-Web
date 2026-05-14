import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Products from '../views/Products.vue'
import ProductDetails from '../views/ProductDetails.vue'
import Cart from '../views/Cart.vue'

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
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/Orders.vue'),
    meta: { requiresAuth: true },
  },

  /* ==========================================================================
     👑 🎯 ADMIN & MANAGER CONTROL ROUTE PIPELINE (NEWLY ADDED)
     ========================================================================== */
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'), // অ্যাডমিন লেআউট রেন্ডার করবে
    meta: { requiresAuth: true, roles: [1, 2] }, // ১ = Admin, ২ = Manager অ্যাক্সেস পাবে
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue'),
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('../views/admin/Orders.vue'),
      },
      {
        path: 'products', // 🎯 এই নতুন চাইল্ড রাউটটি যোগ করুন (ইউআরএল হবে: /admin/products)
        name: 'AdminProducts',
        component: () => import('../views/admin/Products.vue'), // এই ভিউটি তৈরি করতে হবে (src/views/admin/Products.vue)
      },
      {
        path: 'categories-brands',
        name: 'CategoryBrand',
        component: () => import('../views/admin/CategoryBrand.vue'),
      },
      {
        path: 'reports',
        name: 'AdminReports',
        component: () => import('../views/admin/Reports.vue'),
      },
    ],
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('../views/Unauthorized.vue'), // পারমিশন না থাকলে এই পেজ দেখাবে
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔒 গ্লোবাল রাউট গার্ড (আপডেটেড সিকিউরিটি মেকানিজম)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // ১. ইউজার অথেনটিকেটেড কিনা চেক
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // ২. লগইন থাকা অবস্থায় পুনরায় লগইন/রেজিস্টার পেজে যাওয়া ব্লক করা
  if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    return next({ name: 'Dashboard' })
  }

  // ৩. রোল-বেসড অ্যাক্সেস কন্ট্রোল (RBAC) ভ্যালিডেশন গার্ড
  if (to.meta.roles) {
    // আপনার authStore-এর ইউজার অবজেক্ট থেকে role_id বের করা হচ্ছে (যেমন: authStore.user.role_id)
    const userRoleId = authStore.user?.role_id

    if (!userRoleId || !to.meta.roles.includes(userRoleId)) {
      // যদি রোল ম্যাচ না করে তবে Unauthorized পেজে রিডাইরেক্ট করবে
      return next({ name: 'Unauthorized' })
    }
  }

  // সব কন্ডিশন পাস হলে রুট এলাও করবে
  next()
})

export default router
