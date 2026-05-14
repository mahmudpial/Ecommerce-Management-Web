import { defineStore } from 'pinia'
import axiosClient from '../api/axios'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    categories: [], // ক্যাটাগরি ফিল্টারের জন্য
    brands: [],
    loading: false,
    pagination: null,
  }),
  actions: {
    async fetchProducts(params = {}) {
      this.loading = true
      try {
        // params এ search, category_id, min_price ইত্যাদি থাকবে
        const response = await axiosClient.get('/products', { params })
        this.products = response.data.data
        this.pagination = response.data // পেজিনেশনের জন্য
      } catch (error) {
        console.error('পণ্য লোড করা যায়নি', error)
      } finally {
        this.loading = false
      }
    },
    async fetchCategories() {
      try {
        const response = await axiosClient.get('/categories')
        // যদি ডাটা response.data.data তে থাকে তবে সেটা দিন, নাহলে শুধু response.data
        this.categories = response.data.data || response.data
      } catch (error) {
        console.error('Categories fetch error:', error)
      }
    },
    async fetchBrands() {
      try {
        const response = await axiosClient.get('/brands')
        this.brands = response.data.data || response.data
      } catch (error) {
        console.error('Brands fetch error:', error)
      }
    },
  },
})
