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
    async login(credentials) {
      try {
        const response = await axiosClient.post('/login', credentials)
        this.token = response.data.access_token
        this.user = response.data.user
        this.role = response.data.user.role.name

        localStorage.setItem('AUTH_TOKEN', this.token)
        localStorage.setItem('USER_DATA', JSON.stringify(this.user))
        localStorage.setItem('USER_ROLE', this.role)

        return response
      } catch (error) {
        throw error
      }
    },
    logout() {
      this.token = null
      this.user = null
      this.role = null
      localStorage.removeItem('AUTH_TOKEN')
      localStorage.removeItem('USER_DATA')
      localStorage.removeItem('USER_ROLE')
    },
  },
})
