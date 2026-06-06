import { trips as TRIPS } from './trips.mock'

const STORAGE_KEY = 'rahhal_trips_v1'

const cloneTrip = (trip) => ({
  ...trip,
  tags: Array.isArray(trip.tags) ? [...trip.tags] : [],
  badges: Array.isArray(trip.badges) ? [...trip.badges] : [],
})

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export const getDefaultTrips = () => TRIPS.map(cloneTrip)

export const loadTrips = () => {
  if (!canUseStorage()) return getDefaultTrips()

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultTrips()

    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return getDefaultTrips()

    const sanitized = data
      .map((trip) => (trip && typeof trip === 'object' && trip.id ? cloneTrip(trip) : null))
      .filter(Boolean)

    return sanitized.length ? sanitized : getDefaultTrips()
  } catch {
    return getDefaultTrips()
  }
}

export const saveTrips = (trips) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
}

export const resetTripsStorage = () => {
  if (!canUseStorage()) return
  window.localStorage.removeItem(STORAGE_KEY)
}

export const createTripId = (existingIds = new Set()) => {
  let nextId = ''
  do {
    nextId = `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
  } while (existingIds.has(nextId))

  return nextId
}
