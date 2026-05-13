import axios from 'axios'

const axiosClient = axios.create({
  // .env file from URL
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

/**
 * request interceptor:
 * before sending any request, it checks if there is an authentication token in localStorage.
 * if the token exists, it adds the token to the Authorization header of the request.
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('AUTH_TOKEN')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

/**
 * response interceptor:
 * if 401 (Unauthorized) error occurs,
 * it means the token has expired,
 * then it will redirect the user to the login page.
 */
axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('AUTH_TOKEN')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default axiosClient
