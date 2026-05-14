import { defineStore } from 'pinia'
import axiosClient from '../api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('USER_DATA')) || null,
    token: localStorage.getItem('AUTH_TOKEN') || null,
    role: localStorage.getItem('USER_ROLE') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'Admin',
  },
  actions: {
    async register(userData) {
      try {
        const response = await axiosClient.post('/register', userData)

        // রেজিস্ট্রেশন সফল হলে অটোমেটিক লগইন করিয়ে দেওয়া ভালো প্র্যাকটিস
        this.token = response.data.access_token
        this.user = response.data.user
        this.role = response.data.user.role?.name || 'User'

        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        localStorage.setItem('AUTH_TOKEN', this.token)
        localStorage.setItem('USER_DATA', JSON.stringify(this.user))
        localStorage.setItem('USER_ROLE', this.role)

        return response
      } catch (error) {
        throw error
      }
    },
    async login(credentials) {
      try {
        // ১. প্রথমে এপিআই কল করে রেসপন্স নিন
        const response = await axiosClient.post('/login', credentials)

        // ২. রেসপন্স থেকে ডাটা বের করুন
        this.token = response.data.access_token
        this.user = response.data.user
        this.role = response.data.user.role?.name || 'User' // Optional chaining ব্যবহার করা নিরাপদ

        // ৩. এক্সিওস ক্লায়েন্টের জন্য ডিফল্ট হেডার সেট করুন (পরবর্তী রিকোয়েস্টগুলোর জন্য)
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        // ৪. লোকাল স্টোরেজে ডাটা সেভ করুন
        localStorage.setItem('AUTH_TOKEN', this.token)
        localStorage.setItem('USER_DATA', JSON.stringify(this.user))
        localStorage.setItem('USER_ROLE', this.role)

        return response
      } catch (error) {
        // কোনো ভুল হলে হেডার ক্লিন করে দিন (নিরাপত্তার জন্য)
        delete axiosClient.defaults.headers.common['Authorization']
        throw error
      }
    },
    async logout() {
      try {
        await axiosClient.post('/logout') // সার্ভার সাইড টোকেন ডিলিট
      } catch (error) {
        console.error('Logout error', error)
      } finally {
        // ফ্রন্টএন্ড ক্লিনিং (এটি সবসময় হবেই)
        this.token = null
        this.user = null
        this.role = null
        localStorage.removeItem('AUTH_TOKEN')
        localStorage.removeItem('USER_DATA')
        localStorage.removeItem('USER_ROLE')
        delete axiosClient.defaults.headers.common['Authorization']
      }
    },
  },
})
