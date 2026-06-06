const STORAGE_KEY = 'rahhalUser'
const SESSION_EVENT = 'rahhal-user-change'

export function normalizeUserRole(role) {
  if (typeof role !== 'string') return ''
  return role.trim().toUpperCase()
}

export function readStoredUser() {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function isAuthenticated() {
  return Boolean(readStoredUser())
}

export function getUserRole(user = readStoredUser()) {
  return normalizeUserRole(user?.role)
}

export function isAdminUser(user = readStoredUser()) {
  return getUserRole(user) === 'ADMIN'
}

export function persistUser(user) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event(SESSION_EVENT))
}

export function clearStoredUser() {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event(SESSION_EVENT))
}

export function getSessionEventName() {
  return SESSION_EVENT
}

export function buildLoginRedirectPath(path = null) {
  const currentPath =
    path ??
    (typeof window === 'undefined'
      ? '/login'
      : `${window.location.pathname}${window.location.search}${window.location.hash}`)

  if (currentPath === '/login') {
    return '/login'
  }

  return `/login?redirect=${encodeURIComponent(currentPath)}`
}
