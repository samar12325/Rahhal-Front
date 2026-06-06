import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
let pendingQueue = []

const flushQueue = (error) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve()
    }
  })
  pendingQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const isAuthRoute =
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/register') ||
      original?.url?.includes('/auth/refresh')

    if (error?.response?.status === 401 && !isAuthRoute && !original?._retry) {
      original._retry = true

      if (isRefreshing) {
        await new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        })
        return api(original)
      }

      isRefreshing = true
      try {
        await api.post('/auth/refresh')
        flushQueue()
        return api(original)
      } catch (refreshError) {
        flushQueue(refreshError)
        throw refreshError
      } finally {
        isRefreshing = false
      }
    }

    throw error
  },
)

export const apiRequest = async (path, options = {}) => {
  const { body, headers, ...rest } = options

  try {
    const response = await api({
      url: path,
      data: body,
      headers: { ...headers },
      method: rest.method ?? 'GET',
      ...rest,
    })

    return response.data
  } catch (err) {
    const payload = err?.response?.data
    const message = Array.isArray(payload?.message)
      ? payload.message.join(', ')
      : payload?.message || err?.message || 'Request failed'
    const error = new Error(message)
    error.status = err?.response?.status
    throw error
  }
}
