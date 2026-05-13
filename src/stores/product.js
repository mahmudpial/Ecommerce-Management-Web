import { defineStore } from 'pinia'
import axiosClient from '../api/axios'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
  }),
  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        const response = await axiosClient.get('/products')
        // আপনার ব্যাকএন্ড যদি পেজিনেশন দেয়, তবে response.data.data হবে
        this.products = response.data.data || response.data
      } catch (error) {
        console.error('প্রোডাক্ট লোড করতে সমস্যা হচ্ছে', error)
      } finally {
        this.loading = false
      }
    },
  },
})
