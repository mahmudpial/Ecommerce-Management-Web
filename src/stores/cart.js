import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || [],
  }),
  getters: {
    cartCount: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
  },
  actions: {
    addToCart(product, quantity = 1) {
      const existingItem = this.items.find((item) => item.id === product.id)
      if (existingItem) {
        // স্টক চেক করে কোয়ান্টিটি বাড়ানো
        if (existingItem.quantity + quantity <= product.stock) {
          existingItem.quantity += quantity
        } else {
          alert('Stock limit reached!')
        }
      } else {
        this.items.push({ ...product, quantity })
      }
      this.saveToLocalStorage()
    },
    removeFromCart(id) {
      this.items = this.items.filter((item) => item.id !== id)
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },
    // updateQuantity ফাংশনটি actions এর ভেতর যোগ করুন
    updateQuantity(id, amount) {
      const item = this.items.find((i) => i.id === id)
      if (item) {
        if (item.quantity + amount > 0 && item.quantity + amount <= item.stock) {
          item.quantity += amount
        }
        this.saveToLocalStorage()
      }
    },
  },
})
