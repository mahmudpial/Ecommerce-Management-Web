import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', //laravel api of base url
})

// Request interceptor to add token to headers
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('TOKEN') // or from Pinia store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosClient
