import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../Home/Home.css'
import './Profile.css'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'
import {
  clearStoredUser,
  getSessionEventName,
  isAuthenticated as hasStoredSession,
  persistUser,
  readStoredUser,
} from '../../auth/session'
import { localizeGroupTripValue } from '../../components/groupTrips/groupTripsLocale'

const defaultUserDetails = {
  fullName: 'Noura Abdullah',
  email: 'noura@rahhal.sa',
  phone: '+966 55 123 4567',
}

const profileTripTranslations = {
  en: {
    titles: {
      'رحلة العلا - يومين': 'AlUla trip - 2 days',
      'جولة جدة البحرية': 'Jeddah sea tour',
      'ترحال أبها الجبلي': 'Abha mountain escape',
      'رحلة الطائف الثقافية': 'Taif cultural trip',
      'جولة الرياض التراثية': 'Riyadh heritage tour',
      'الخبر على البحر': 'Khobar by the sea',
      'الفيل الصخري وما حوله': 'Elephant Rock and beyond',
      'رحلة البحر الأحمر': 'Red Sea trip',
    },
    cities: {
      'الرياض': 'Riyadh',
      'جدة': 'Jeddah',
      'العلا': 'AlUla',
      'أبها': 'Abha',
      'الخبر': 'Khobar',
      'الطائف': 'Taif',
      'أملج': 'Umluj',
      'الدمام': 'Dammam',
      'تبوك': 'Tabuk',
      'مكة': 'Makkah',
      'نجران': 'Najran',
    },
  },
}

const profileNameTranslations = {
  en: {
    'رحال': 'Rahhal',
  },
}

const copy = {
  ar: {
    profileEyebrow: 'حسابي',
    profileTitle: 'الملف الشخصي',
    profileSubtitle: 'إدارة معلوماتك وحجوزاتك بسهولة.',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الجوال',
    save: 'حفظ التغييرات',
    cancel: 'إلغاء',
    edit: 'تعديل البيانات',
    bookingsTitle: 'حجوزاتي',
    bookingsSubtitle: 'تابع تفاصيل رحلاتك الحالية والسابقة.',
    loadingBookings: 'جارٍ تحميل الحجوزات...',
    emptyBookings: 'لا توجد حجوزات بعد.',
    upcoming: 'قادمة',
    completed: 'منتهية',
    tripAlt: 'رحلة',
    tripFallback: 'رحلة غير محددة',
    date: 'التاريخ',
    time: 'الوقت',
    people: 'عدد الأشخاص',
    details: 'عرض التفاصيل',
    participants: 'المشاركون',
    rateTrip: 'قيّم الرحلة',
    viewRating: 'عرض التقييم',
    expiredTag: 'منتهية',
    expiredBarcode: 'انتهت هذه الرحلة ولم يعد هذا الباركود صالحًا.',
    activeBarcode: 'يُستخدم هذا الباركود للتحقق من الحجز قبل الانطلاق.',
    ratingEyebrow: 'قيّم الرحلة',
    ratingFallback: 'رحلتك',
    close: 'إغلاق',
    starsAria: 'التقييم بالنجوم',
    ratingOfFive: 'تقييم {{value}} من 5',
    viewHint: 'هذا تقييمك الحالي ولا يمكن تعديله.',
    commentLabel: 'تعليق قصير عن التجربة',
    commentPlaceholder: 'اكتب لنا أجمل ما حدث خلال الرحلة...',
    selectStarsError: 'اختر عدد النجوم قبل الحفظ.',
    shortCommentError: 'اكتب تعليقًا قصيرًا عن التجربة (6 أحرف على الأقل).',
    invalidBookingError: 'رقم الحجز غير صالح. الرجاء تحديث الحجوزات لربطها بالقاعدة.',
    saveRating: 'حفظ التقييم',
    ratingSaveFailed: 'تعذر حفظ التقييم الآن.',
    loadingBookingsFailed: 'تعذر تحميل الحجوزات حالياً.',
    participantsEyebrow: 'الرحلة الجماعية',
    participantsTitle: 'المشاركون في الرحلة',
    participantsLoading: 'جارٍ تحميل المشاركين...',
    participantsEmpty: 'لا توجد بيانات مشاركين حالياً.',
    participantsLoadFailed: 'تعذر تحميل المشاركين حالياً.',
    participantName: 'الاسم',
    participantEmail: 'البريد الإلكتروني',
    participantPeople: 'عدد الأشخاص',
    participantStatus: 'حالة الحجز',
    participantStatusPaid: 'مدفوع',
    participantStatusPending: 'معلق',
    participantStatusCancelled: 'ملغي',
    participantEmailUnavailable: 'غير متاح',
    participantFallbackName: 'مشارك',
  },
  en: {
    profileEyebrow: 'My account',
    profileTitle: 'Profile',
    profileSubtitle: 'Manage your details and bookings with ease.',
    fullName: 'Full name',
    email: 'Email',
    phone: 'Phone number',
    save: 'Save changes',
    cancel: 'Cancel',
    edit: 'Edit details',
    bookingsTitle: 'My bookings',
    bookingsSubtitle: 'Track your current and past trip details.',
    loadingBookings: 'Loading bookings...',
    emptyBookings: 'No bookings yet.',
    upcoming: 'Upcoming',
    completed: 'Completed',
    tripAlt: 'Trip',
    tripFallback: 'Unnamed trip',
    date: 'Date',
    time: 'Time',
    people: 'People',
    details: 'View details',
    participants: 'Participants',
    rateTrip: 'Rate trip',
    viewRating: 'View rating',
    expiredTag: 'Expired',
    expiredBarcode: 'This trip has ended and this barcode is no longer valid.',
    activeBarcode: 'Use this barcode to verify the booking before departure.',
    ratingEyebrow: 'Rate trip',
    ratingFallback: 'Your trip',
    close: 'Close',
    starsAria: 'Star rating',
    ratingOfFive: 'Rate {{value}} out of 5',
    viewHint: 'This is your current rating and it cannot be edited.',
    commentLabel: 'Short comment about the experience',
    commentPlaceholder: 'Tell us the best part of the trip...',
    selectStarsError: 'Choose a star rating before saving.',
    shortCommentError: 'Write a short comment about the experience (at least 6 characters).',
    invalidBookingError: 'Booking number is invalid. Refresh bookings to sync with the database.',
    saveRating: 'Save rating',
    ratingSaveFailed: 'Unable to save the rating right now.',
    loadingBookingsFailed: 'Unable to load bookings right now.',
    participantsEyebrow: 'Group trip',
    participantsTitle: 'Trip participants',
    participantsLoading: 'Loading participants...',
    participantsEmpty: 'No participant data is available right now.',
    participantsLoadFailed: 'Unable to load participants right now.',
    participantName: 'Name',
    participantEmail: 'Email',
    participantPeople: 'People count',
    participantStatus: 'Booking status',
    participantStatusPaid: 'Paid',
    participantStatusPending: 'Pending',
    participantStatusCancelled: 'Cancelled',
    participantEmailUnavailable: 'Not available',
    participantFallbackName: 'Participant',
  },
}

function formatDate(value, locale) {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(value))
  } catch {
    return value
  }
}

function formatTime(value, locale) {
  if (!value) return ''
  const [hours = '0', minutes = '0'] = value.split(':')
  const date = new Date()
  date.setHours(Number(hours), Number(minutes), 0, 0)
  try {
    return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric' }).format(date)
  } catch {
    return value
  }
}

function mergeStoredUser(overrides) {
  const stored = readStoredUser() ?? {}
  return {
    ...stored,
    ...overrides,
  }
}

const localizeProfileTripTitle = (language, trip) => {
  const title = trip?.title
  if (!title || language === 'ar') return title

  if (trip?.type === 'group') {
    return localizeGroupTripValue(language, 'titles', title)
  }

  return profileTripTranslations[language]?.titles?.[title] ?? title
}

const localizeProfileTripCity = (language, trip) => {
  const city = trip?.city
  if (!city || language === 'ar') return city

  if (trip?.type === 'group') {
    return localizeGroupTripValue(language, 'cities', city)
  }

  return profileTripTranslations[language]?.cities?.[city] ?? city
}

const localizeProfileName = (language, value) => {
  if (!value || language === 'ar') return value
  return profileNameTranslations[language]?.[value] ?? value
}

const qrMatrix = [
  '111111101000101111111',
  '100000101010101000001',
  '101110101000101011101',
  '101110101110101011101',
  '101110101000101011101',
  '100000101010101000001',
  '111111101000101111111',
  '000010101110101000010',
  '111010001010001011110',
  '101010111011101010100',
  '111010100010001011110',
  '000010111010111000010',
  '111111101110101111111',
  '100000100010001000001',
  '101110111011101011101',
  '101110100010001011101',
  '101110111110111011101',
  '100000100010001000001',
  '111111101110101111111',
  '000000100010001000000',
  '111111111111111111111',
]

function QrPlaceholder({ ariaLabel }) {
  return (
    <div className="qrPlaceholder" role="img" aria-label={ariaLabel}>
      {qrMatrix.map((row, rowIndex) => (
        <div className="qrRow" key={`qr-row-${rowIndex}`}>
          {row.split('').map((value, cellIndex) => (
            <span
              key={`qr-cell-${rowIndex}-${cellIndex}`}
              className={`qrCell ${value === '1' ? 'filled' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function Profile() {
  const navigate = useNavigate()
  const location = useLocation()
  const { language, dir } = useLanguage()
  const text = copy[language] ?? copy.ar
  const locale = language === 'en' ? 'en-US' : 'ar-SA'
  const statusCopy = { upcoming: text.upcoming, completed: text.completed }

  const [userDetails, setUserDetails] = useState(defaultUserDetails)
  const [formValues, setFormValues] = useState(defaultUserDetails)
  const [isEditing, setIsEditing] = useState(false)
  const [expandedBookings, setExpandedBookings] = useState([])
  const [reviews, setReviews] = useState({})
  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [bookingsError, setBookingsError] = useState('')
  const [ratingTarget, setRatingTarget] = useState(null)
  const [ratingValue, setRatingValue] = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [ratingError, setRatingError] = useState('')
  const [ratingMode, setRatingMode] = useState('create')
  const [participantsModal, setParticipantsModal] = useState(null)
  const [participants, setParticipants] = useState([])
  const [participantsLoading, setParticipantsLoading] = useState(false)
  const [participantsError, setParticipantsError] = useState('')
  const [participantsViewerRole, setParticipantsViewerRole] = useState('user')
  const [isLoggedIn, setIsLoggedIn] = useState(() => hasStoredSession())

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(hasStoredSession())
    }

    window.addEventListener('storage', handleAuthChange)
    window.addEventListener(getSessionEventName(), handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleAuthChange)
      window.removeEventListener(getSessionEventName(), handleAuthChange)
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      setBookings([])
      setBookingsLoading(false)
      setBookingsError('')
      navigate('/login?redirect=%2Fprofile', { replace: true })
    }
  }, [isLoggedIn, navigate])

  useEffect(() => {
    if (!isLoggedIn) return

    const loadProfile = async () => {
      try {
        const payload = await apiRequest('/me')
        if (payload) {
          const normalized = mergeStoredUser({
            id: payload.id,
            name: payload.name ?? '',
            fullName: payload.name ?? '',
            email: payload.email ?? '',
            phone: payload.phone ?? '',
            role: payload.role,
          })
          setUserDetails(normalized)
          setFormValues(normalized)
          persistUser(normalized)
          return
        }
      } catch (err) {
        if (err?.status === 401) {
          clearStoredUser()
          return
        }
      }

      const stored = readStoredUser()
      if (stored) {
        setUserDetails(stored)
        setFormValues(stored)
      }
    }

    loadProfile()
  }, [isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn) return

    let isMounted = true
    const loadBookings = async () => {
      setBookingsLoading(true)
      setBookingsError('')
      try {
        const payload = await apiRequest('/me/bookings')
        if (!isMounted) return
        const items = Array.isArray(payload?.items) ? payload.items : []
        setBookings(items)
        const seededReviews = items.reduce((acc, booking) => {
          if (booking?.review) acc[booking.id] = booking.review
          return acc
        }, {})
        setReviews(seededReviews)
      } catch (err) {
        if (!isMounted) return
        if (err?.status === 401) {
          clearStoredUser()
          return
        }
        setBookings([])
        setBookingsError(err?.message || text.loadingBookingsFailed)
      } finally {
        if (isMounted) setBookingsLoading(false)
      }
    }

    loadBookings()
    return () => {
      isMounted = false
    }
  }, [isLoggedIn, text.loadingBookingsFailed])

  useEffect(() => {
    if (!location.hash) return

    const elementId = location.hash.replace('#', '')
    if (!elementId) return

    const scrollToSection = () => {
      const element = document.getElementById(elementId)
      if (!element) return false

      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return true
    }

    if (scrollToSection()) return

    const timerId = window.setTimeout(scrollToSection, 120)
    return () => window.clearTimeout(timerId)
  }, [location.hash, bookingsLoading])

  const handleEditToggle = () => {
    setFormValues(userDetails)
    setIsEditing(true)
  }

  const handleFieldChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    setFormValues(userDetails)
    setIsEditing(false)
  }

  const handleSave = async () => {
    try {
      const payload = await apiRequest('/me', {
        method: 'PATCH',
        body: {
          name: formValues.fullName?.trim(),
          email: formValues.email?.trim().toLowerCase(),
          phone: formValues.phone?.trim() || null,
        },
      })

      const normalized = mergeStoredUser({
        id: payload?.id,
        name: payload?.name ?? formValues.fullName,
        fullName: payload?.name ?? formValues.fullName,
        email: payload?.email ?? formValues.email,
        phone: payload?.phone ?? formValues.phone,
        role: payload?.role,
      })

      setUserDetails(normalized)
      setFormValues(normalized)
      persistUser(normalized)
      setIsEditing(false)
    } catch (err) {
      if (err?.status === 401) {
        clearStoredUser()
        return
      }

      const normalized = mergeStoredUser(formValues)
      setUserDetails(normalized)
      persistUser(normalized)
      setIsEditing(false)
    }
  }

  const toggleBookingDetails = (id) => {
    setExpandedBookings((prev) =>
      prev.includes(id) ? prev.filter((bookingId) => bookingId !== id) : [...prev, id],
    )
  }

  const openRatingModal = (booking, trip, options = {}) => {
    const existingReview = reviews[booking.id]
    const mode = options.mode === 'view' && existingReview ? 'view' : 'create'
    setRatingTarget({ booking, trip })
    setRatingMode(mode)
    setRatingValue(existingReview?.rating || 0)
    setRatingComment(existingReview?.comment || '')
    setRatingError('')
  }

  const closeRatingModal = () => {
    setRatingTarget(null)
    setRatingValue(0)
    setRatingComment('')
    setRatingError('')
    setRatingMode('create')
  }

  const handleRatingSubmit = async () => {
    if (!ratingTarget?.booking || ratingMode === 'view') return
    if (!ratingValue) {
      setRatingError(text.selectStarsError)
      return
    }

    const trimmedComment = ratingComment.trim()
    if (trimmedComment.length < 6) {
      setRatingError(text.shortCommentError)
      return
    }

    if (!/^\d+$/.test(String(ratingTarget.booking.id))) {
      setRatingError(text.invalidBookingError)
      return
    }

    try {
      await apiRequest('/reviews', {
        method: 'POST',
        body: {
          bookingId: Number(ratingTarget.booking.id),
          rating: ratingValue,
          comment: trimmedComment,
        },
      })
      setReviews((prev) => ({
        ...prev,
        [ratingTarget.booking.id]: {
          rating: ratingValue,
          comment: trimmedComment,
        },
      }))
      closeRatingModal()
    } catch (err) {
      if (err?.status === 401) {
        clearStoredUser()
        return
      }
      setRatingError(err?.message || text.ratingSaveFailed)
    }
  }

  const openParticipantsModal = async (booking) => {
    if (!booking?.tripId) return

    setParticipantsModal({
      tripId: booking.tripId,
      tripTitle: booking.trip?.title || text.tripFallback,
      tripCity: booking.trip?.city || '',
    })
    setParticipants([])
    setParticipantsError('')
    setParticipantsLoading(true)
    setParticipantsViewerRole('user')

    try {
      const payload = await apiRequest(`/api/group-trips/${booking.tripId}/participants`)
      const items = Array.isArray(payload?.participants) ? payload.participants : []
      setParticipantsViewerRole(payload?.viewer_role === 'admin' ? 'admin' : 'user')
      setParticipants(items)
    } catch (err) {
      if (err?.status === 401) {
        clearStoredUser()
        return
      }
      setParticipants([])
      setParticipantsError(err?.message || text.participantsLoadFailed)
    } finally {
      setParticipantsLoading(false)
    }
  }

  const closeParticipantsModal = () => {
    setParticipantsModal(null)
    setParticipants([])
    setParticipantsError('')
    setParticipantsLoading(false)
    setParticipantsViewerRole('user')
  }

  const getParticipantStatusLabel = (status) => {
    if (status === 'paid') return text.participantStatusPaid
    if (status === 'cancelled') return text.participantStatusCancelled
    return text.participantStatusPending
  }

  const isRatingModalOpen = Boolean(ratingTarget)
  const isViewMode = ratingMode === 'view'

  const setStarValue = (value) => {
    if (isViewMode) return
    setRatingValue(value)
  }

  return (
    <div className="profilePage" dir={dir}>
      <div className="profileMain">
        <header className="profileHeader" id="top">
          <p className="profileEyebrow">{text.profileEyebrow}</p>
          <h1>{text.profileTitle}</h1>
          <p className="profileSubtitle">{text.profileSubtitle}</p>
        </header>

        <section className="profileInfoCard">
          {isEditing ? (
            <>
              <label className="profileField">
                <span>{text.fullName}</span>
                <input
                  className="profileInput"
                  type="text"
                  value={formValues.fullName}
                  onChange={(event) => handleFieldChange('fullName', event.target.value)}
                />
              </label>
              <label className="profileField">
                <span>{text.email}</span>
                <input
                  className="profileInput"
                  type="email"
                  value={formValues.email}
                  onChange={(event) => handleFieldChange('email', event.target.value)}
                />
              </label>
              <label className="profileField">
                <span>{text.phone}</span>
                <input
                  className="profileInput"
                  type="tel"
                  value={formValues.phone}
                  onChange={(event) => handleFieldChange('phone', event.target.value)}
                />
              </label>
              <div className="profileActions">
                <button className="primaryBtn" type="button" onClick={handleSave}>
                  {text.save}
                </button>
                <button className="ghostBtn" type="button" onClick={handleCancel}>
                  {text.cancel}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="profileInfoRow">
                <span>{text.fullName}</span>
                <strong>{localizeProfileName(language, userDetails.fullName)}</strong>
              </div>
              <div className="profileInfoRow">
                <span>{text.email}</span>
                <strong>{userDetails.email}</strong>
              </div>
              <div className="profileInfoRow">
                <span>{text.phone}</span>
                <strong>{userDetails.phone}</strong>
              </div>
              <button className="secondaryBtn profileEditBtn" type="button" onClick={handleEditToggle}>
                {text.edit}
              </button>
            </>
          )}
        </section>

        <section className="profileBookings" id="bookings">
          <div className="sectionHead">
            <h2 className="sectionTitle">{text.bookingsTitle}</h2>
            <p className="sectionSubtitle">{text.bookingsSubtitle}</p>
          </div>

          <div className="bookingsGrid">
            {bookingsLoading ? (
              <div className="bookingsEmpty">
                <p>{text.loadingBookings}</p>
              </div>
            ) : bookingsError ? (
              <div className="bookingsEmpty">
                <p>{bookingsError}</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bookingsEmpty">
                <p>{text.emptyBookings}</p>
              </div>
            ) : (
              bookings.map((booking) => {
                const trip = booking.trip
                const localizedTripTitle = localizeProfileTripTitle(language, trip) || text.tripFallback
                const localizedTripCity = localizeProfileTripCity(language, trip)
                const isGroupTrip = trip?.type === 'group'
                const hasEnded = booking.hasEnded ?? booking.status === 'completed'
                const visualStatus = hasEnded ? 'completed' : 'upcoming'
                const review = reviews[booking.id]
                const showRatingCTA = booking.canReview ?? (hasEnded && !review)

                return (
                  <article className="bookingCard" key={booking.id}>
                    <div className="bookingImage">
                      <img src={trip?.image} alt={localizedTripTitle || text.tripAlt} />
                      <span className={`bookingStatus ${visualStatus}`}>
                        {statusCopy[visualStatus] || visualStatus}
                      </span>
                    </div>
                    <div className="bookingBody">
                      <div className="bookingTitle">
                        <h3>{localizedTripTitle}</h3>
                        <p>{localizedTripCity}</p>
                      </div>
                      <ul className="bookingMeta">
                        <li>
                          <span>{text.date}</span>
                          <strong>{formatDate(booking.date, locale)}</strong>
                        </li>
                        <li>
                          <span>{text.time}</span>
                          <strong>{formatTime(booking.time, locale)}</strong>
                        </li>
                        <li>
                          <span>{text.people}</span>
                          <strong>{booking.people}</strong>
                        </li>
                      </ul>

                      <button
                        type="button"
                        className="secondaryBtn bookingDetailsBtn"
                        onClick={() => toggleBookingDetails(booking.id)}
                      >
                        {text.details}
                      </button>

                      {isGroupTrip ? (
                        <button
                          type="button"
                          className="secondaryBtn bookingDetailsBtn"
                          onClick={() => openParticipantsModal(booking)}
                        >
                          {text.participants}
                        </button>
                      ) : null}

                      {showRatingCTA ? (
                        <button
                          type="button"
                          className="primaryBtn bookingRateBtn"
                          onClick={() => openRatingModal(booking, trip)}
                        >
                          {text.rateTrip}
                        </button>
                      ) : null}

                      {review ? (
                        <button
                          type="button"
                          className="ghostBtn viewRatingBtn"
                          onClick={() => openRatingModal(booking, trip, { mode: 'view' })}
                        >
                          {text.viewRating}
                        </button>
                      ) : null}

                      {expandedBookings.includes(booking.id) ? (
                        <div className="bookingExtra">
                          <div className={`barcodeWrapper ${hasEnded ? 'isExpired' : ''}`}>
                            <QrPlaceholder ariaLabel={text.details} />
                            {hasEnded ? (
                              <div className="barcodeOverlay" aria-hidden="true">
                                <span className="barcodeXMark">×</span>
                                <span className="barcodeTag">{text.expiredTag}</span>
                              </div>
                            ) : null}
                          </div>
                          <p className="barcodeHint">
                            {hasEnded ? text.expiredBarcode : text.activeBarcode}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </section>
      </div>

      {isRatingModalOpen ? (
        <div className="ratingModalOverlay">
          <div
            className="ratingModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rating-modal-title"
          >
            <div className="ratingModalHead">
              <div>
                <p className="ratingEyebrow">{text.ratingEyebrow}</p>
                <h3 id="rating-modal-title">
                  {localizeProfileTripTitle(language, ratingTarget?.trip) || text.ratingFallback}
                </h3>
                <p className="ratingSub">{localizeProfileTripCity(language, ratingTarget?.trip)}</p>
              </div>
              <button
                type="button"
                className="ghostBtn ratingCloseBtn"
                onClick={closeRatingModal}
                aria-label={text.close}
              >
                &times;
              </button>
            </div>
            <div className="ratingStarsInput" role="group" aria-label={text.starsAria}>
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1
                return (
                  <button
                    type="button"
                    key={`rating-input-${value}`}
                    className={`ratingStarBtn ${ratingValue >= value ? 'isActive' : ''} ${
                      isViewMode ? 'isLocked' : ''
                    }`}
                    onClick={() => setStarValue(value)}
                    aria-label={text.ratingOfFive.replace('{{value}}', value)}
                    disabled={isViewMode}
                  >
                    ★
                  </button>
                )
              })}
            </div>
            {isViewMode ? <p className="ratingViewHint">{text.viewHint}</p> : null}
            <label className="ratingField">
              <span>{text.commentLabel}</span>
              <textarea
                value={ratingComment}
                onChange={(event) => setRatingComment(event.target.value)}
                maxLength={320}
                rows={4}
                placeholder={text.commentPlaceholder}
                className={`ratingTextarea ${isViewMode ? 'isReadOnly' : ''}`}
                readOnly={isViewMode}
              />
            </label>
            {!isViewMode && ratingError ? <p className="ratingError">{ratingError}</p> : null}
            <div className={`ratingModalActions ${isViewMode ? 'isViewMode' : ''}`}>
              {isViewMode ? (
                <button
                  type="button"
                  className="ghostBtn ratingDismissBtn isFull"
                  onClick={closeRatingModal}
                >
                  {text.close}
                </button>
              ) : (
                <>
                  <button type="button" className="primaryBtn" onClick={handleRatingSubmit}>
                    {text.saveRating}
                  </button>
                  <button
                    type="button"
                    className="ghostBtn ratingDismissBtn"
                    onClick={closeRatingModal}
                  >
                    {text.close}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {participantsModal ? (
        <div className="ratingModalOverlay">
          <div
            className="ratingModal participantsModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="participants-modal-title"
          >
            <div className="ratingModalHead">
              <div>
                <p className="ratingEyebrow">{text.participantsEyebrow}</p>
                <h3 id="participants-modal-title">{text.participantsTitle}</h3>
                <p className="ratingSub">
                  {localizeProfileTripTitle(language, {
                    title: participantsModal.tripTitle,
                    city: participantsModal.tripCity,
                    type: 'group',
                  })}
                  {participantsModal.tripCity
                    ? ` - ${localizeProfileTripCity(language, {
                        title: participantsModal.tripTitle,
                        city: participantsModal.tripCity,
                        type: 'group',
                      })}`
                    : ''}
                </p>
              </div>
              <button
                type="button"
                className="ghostBtn ratingCloseBtn"
                onClick={closeParticipantsModal}
                aria-label={text.close}
              >
                &times;
              </button>
            </div>

            {participantsLoading ? (
              <p className="ratingViewHint">{text.participantsLoading}</p>
            ) : participantsError ? (
              <p className="ratingError">{participantsError}</p>
            ) : participants.length === 0 ? (
              <p className="ratingViewHint">{text.participantsEmpty}</p>
            ) : (
              <div className="participantsList">
                {participants.map((participant) => (
                  <article className="participantCard" key={participant.booking_id}>
                    <div className="participantRow">
                      <span>{text.participantName}</span>
                      <strong>{participant.name || text.participantFallbackName}</strong>
                    </div>
                    <div className="participantRow">
                      <span>{text.participantPeople}</span>
                      <strong>{participant.persons_count ?? 1}</strong>
                    </div>
                    {participantsViewerRole === 'admin' ? (
                      <div className="participantRow">
                        <span>{text.participantEmail}</span>
                        <strong>{participant.email || text.participantEmailUnavailable}</strong>
                      </div>
                    ) : null}
                    {participantsViewerRole === 'admin' ? (
                      <div className="participantRow">
                        <span>{text.participantStatus}</span>
                        <strong>{getParticipantStatusLabel(participant.status)}</strong>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            )}

            <div className="ratingModalActions isViewMode">
              <button
                type="button"
                className="ghostBtn ratingDismissBtn isFull"
                onClick={closeParticipantsModal}
              >
                {text.close}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Profile
