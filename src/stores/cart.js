import { defineStore } from 'pinia'
import axiosClient from '../api/axios' // আপনার এক্সিওস ক্লায়েন্ট ইমপোর্ট করুন

export const useCartStore = defineStore('cart', {
  state: () => ({
    // ব্যাকএন্ড থেকে আসা কার্ট আইটেমগুলো এখানে থাকবে
    items: [],
    loading: false,
  }),

  getters: {
    // লারাভেল রেসপন্স স্ট্রাকচার অনুযায়ী কাউন্ট এবং প্রাইস ক্যালকুলেশন
    // নোট: লারাভেলে CartItem-এর ভেতরে product রিলেশনশিপ আছে (item.product.price)
    cartCount: (state) => {
      return state.items.reduce((acc, item) => acc + item.quantity, 0)
    },
    totalPrice: (state) => {
      return state.items.reduce((acc, item) => {
        const price = item.product ? item.product.price : item.price
        return acc + price * item.quantity
      }, 0)
    },
  },

  actions: {
    // ১. ডাটাবেজ থেকে কার্ট আইটেমগুলো লোড করা (App.vue বা Login এর পর কল করবেন)
    async fetchCart() {
      this.loading = true
      try {
        const response = await axiosClient.get('/cart')
        // লারাভেল CartController@index থেকে আসা ডাটা সেভ
        this.items = response.data
      } catch (error) {
        console.error('Cart fetch failed:', error)
        // যদি ইউজার লগইন না থাকে, তবে ব্যাকআপ হিসেবে লোকাল স্টোরেজ দেখতে পারে
        this.items = JSON.parse(localStorage.getItem('cart')) || []
      } finally {
        this.loading = false
      }
    },

    // ২. কার্টে প্রোডাক্ট যোগ করা (লারাভেল CartController@store এর সাথে সিঙ্ক)
    async addToCart(product, quantity = 1) {
      try {
        // ব্যাকএন্ডে রিকোয়েস্ট পাঠানো (routes/api.php অনুযায়ী /cart/add)
        const response = await axiosClient.post('/cart/add', {
          product_id: product.id,
          quantity: quantity,
        })

        // ব্যাকএন্ডে সফলভাবে সেভ হলে লোকাল স্টেট রি-ফেচ করুন
        await this.fetchCart()
        return response
      } catch (error) {
        // লারাভেলের পাঠানো স্টক এরর মেসেজ (যেমন: 'Stock-e jotheshto product nei!') দেখাবে
        const errorMsg = error.response?.data?.message || 'Failed to add product to cart'
        alert(errorMsg)
        throw error
      }
    },

    // ৩. কার্টের কোয়ান্টিটি আপডেট করা (লারাভেল CartController@update এর সাথে সিঙ্ক)
    // stores/cart.js এর ভেতরে updateQuantity মেথডটি এভাবে পরিবর্তন করুন:
    async updateQuantity(cartItemId, newQty) {
      // যদি কোয়ান্টিটি কমাতে কমাতে ১ এর নিচে (অর্থাৎ ০) চলে যায়, তবে আইটেমটি ডিলিট করে দিন
      if (newQty < 1) {
        return this.removeFromCart(cartItemId)
      }

      try {
        // সরাসরি লারাভেলের চাহিদা অনুযায়ী { quantity: newQty } অবজেক্ট পাঠানো হচ্ছে
        await axiosClient.put(`/cart/update/${cartItemId}`, {
          quantity: parseInt(newQty),
        })

        // ডাটাবেজে সাকসেসফুলি আপডেট হলে ফ্রন্টএন্ডে কার্টের নতুন ডাটা রি-ফেচ করুন
        await this.fetchCart()
      } catch (error) {
        console.error('Quantity update failed:', error)
        alert(error.response?.data?.message || 'Quantity update failed')
      }
    },

    // ৪. কার্ট থেকে সিঙ্গেল আইটেম মুছে ফেলা (/cart/remove/{id})
    async removeFromCart(cartItemId) {
      try {
        await axiosClient.delete(`/cart/remove/${cartItemId}`)
        await this.fetchCart() // ডাটা আপডেট
      } catch (error) {
        console.error('Failed to remove item:', error)
      }
    },

    // ৫. পুরো কার্ট খালি করা (Checkout সফল হওয়ার পর বা ম্যানুয়ালি)
    async clearCart() {
      try {
        await axiosClient.delete('/cart/clear')
        this.items = []
      } catch (error) {
        console.error('Failed to clear cart:', error)
      }
    },
  },
})
