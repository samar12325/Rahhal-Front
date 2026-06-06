const STORAGE_KEY = 'rahhal_booking_reviews_v1'
export const REVIEWS_EVENT = 'rahhal-reviews-change'

const canUseStorage = () => typeof window !== 'undefined' && window?.localStorage

const clampRating = (value) => {
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return 0
  return Math.min(5, Math.max(1, Math.round(numeric)))
}

const sanitizeText = (value, max = 140) => {
  if (!value && value !== 0) return ''
  return String(value).trim().slice(0, max)
}

const sanitizeReview = (review) => {
  if (!review || !review.bookingId) return null

  const rating = clampRating(review.rating)
  if (!rating) return null

  const comment = sanitizeText(review.comment, 320)
  if (!comment) return null

  return {
    bookingId: review.bookingId,
    tripId: sanitizeText(review.tripId || '', 40) || null,
    tripTitle: sanitizeText(review.tripTitle || '', 120),
    tripCity: sanitizeText(review.tripCity || '', 80),
    rating,
    comment,
    createdAt: (() => {
      const candidate = sanitizeText(review.createdAt || '')
      const asDate = candidate ? Date.parse(candidate) : NaN
      return Number.isNaN(asDate) ? new Date().toISOString() : new Date(asDate).toISOString()
    })(),
  }
}

const readFromStorage = () => {
  if (!canUseStorage()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((entry) => sanitizeReview(entry))
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch {
    return []
  }
}

const persist = (reviews) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
}

const dispatchUpdate = () => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(REVIEWS_EVENT))
}

export const loadBookingReviews = () => readFromStorage()

export const loadBookingReviewsMap = () =>
  loadBookingReviews().reduce((acc, review) => {
    acc[review.bookingId] = review
    return acc
  }, {})

export const saveBookingReview = (review) => {
  const sanitized = sanitizeReview(review)
  if (!sanitized) return loadBookingReviews()

  const current = loadBookingReviews()
  const filtered = current.filter((entry) => entry.bookingId !== sanitized.bookingId)
  const updated = [sanitized, ...filtered]
  persist(updated)
  dispatchUpdate()
  return updated
}

export const resetReviews = () => {
  if (!canUseStorage()) return
  window.localStorage.removeItem(STORAGE_KEY)
  dispatchUpdate()
}
