import axios from 'axios'
import { buildLoginRedirectPath, clearStoredUser } from '../auth/session'

const envApiUrl = import.meta.env.VITE_API_URL?.trim()

export const API_BASE_URL =
  envApiUrl || (import.meta.env.DEV ? 'http://localhost:3000' : '')

export const resolveApiUrl = (path = '') => {
  if (!API_BASE_URL) return path

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return new URL(normalizedPath, `${API_BASE_URL}/`).toString()
}

const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  withCredentials: true,
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

const clearSessionAndRedirect = () => {
  clearStoredUser()

  if (typeof window === 'undefined') return

  const currentPath = window.location.pathname
  const isProtectedRoute =
    currentPath === '/profile' ||
    currentPath === '/stats' ||
    currentPath.startsWith('/admin')

  if (isProtectedRoute) {
    window.location.assign(buildLoginRedirectPath())
  }
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
        const refreshResponse = await api.post('/auth/refresh')
        if (!refreshResponse?.data?.ok) {
          throw new Error('Session refresh failed')
        }
        flushQueue()
        return api(original)
      } catch (refreshError) {
        flushQueue(refreshError)
        clearSessionAndRedirect()
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
  const requestHeaders = { ...headers }

  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    delete requestHeaders['Content-Type']
  } else if (!requestHeaders['Content-Type'] && body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  try {
    const response = await api({
      url: path,
      data: body,
      headers: requestHeaders,
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
