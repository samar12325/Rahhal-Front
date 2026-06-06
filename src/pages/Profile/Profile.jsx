import { useEffect, useState } from 'react'
import '../Home/Home.css'
import './Profile.css'
import { loadTrips } from '../../data/trips.store'
import { apiRequest } from '../../api/client'

const defaultUserDetails = {
  fullName: 'نورة عبدالله',
  email: 'noura@rahhal.sa',
  phone: '+966 55 123 4567',
}

const bookings = [
  {
    id: 'b1',
    tripId: 't1',
    date: '2026-01-27',
    time: '08:30',
    people: 1,
    status: 'upcoming',
  },
  {
    id: 'b2',
    tripId: 't5',
    date: '2025-11-18',
    time: '18:00',
    people: 3,
    status: 'completed',
  },
]

const statusCopy = {
  upcoming: 'قادمة',
  completed: 'منتهية',
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'long' }).format(new Date(value))
  } catch {
    return value
  }
}

function formatTime(value) {
  if (!value) return ''
  const [hours = '0', minutes = '0'] = value.split(':')
  const date = new Date()
  date.setHours(Number(hours), Number(minutes), 0, 0)
  try {
    return new Intl.DateTimeFormat('ar-SA', { hour: 'numeric', minute: 'numeric' }).format(date)
  } catch {
    return value
  }
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

function QrPlaceholder() {
  return (
    <div className="qrPlaceholder" role="img" aria-label="باركود الحجز">
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

const reviewStars = (rating) =>
  Array.from({ length: 5 }, (_, index) => (
    <span key={`rating-star-${index}`} className={`ratingStar ${index < rating ? 'filled' : ''}`}>
      ★
    </span>
  ))

function Profile() {
  const [trips] = useState(() => loadTrips())
  const [userDetails, setUserDetails] = useState(defaultUserDetails)
  const [formValues, setFormValues] = useState(defaultUserDetails)
  const [isEditing, setIsEditing] = useState(false)
  const [expandedBookings, setExpandedBookings] = useState([])
  const [reviews, setReviews] = useState({})
  const [ratingTarget, setRatingTarget] = useState(null)
  const [ratingValue, setRatingValue] = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [ratingError, setRatingError] = useState('')
  const [ratingMode, setRatingMode] = useState('create')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const payload = await apiRequest('/me')
        if (payload) {
          const normalized = {
            fullName: payload.name ?? '',
            email: payload.email ?? '',
            phone: payload.phone ?? '',
          }
          setUserDetails(normalized)
          setFormValues(normalized)
          localStorage.setItem('rahhalUser', JSON.stringify(normalized))
          return
        }
      } catch {
        // fall back to local storage
      }

      const stored = localStorage.getItem('rahhalUser')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setUserDetails(parsed)
          setFormValues(parsed)
          return
        } catch {
          // ignore
        }
      }
    }

    loadProfile()
  }, [])

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const payload = await apiRequest('/me')
        if (payload) {
          const normalized = {
            fullName: payload.name ?? '',
            email: payload.email ?? '',
            phone: payload.phone ?? '',
          }
          setUserDetails(normalized)
          setFormValues(normalized)
          localStorage.setItem('rahhalUser', JSON.stringify(normalized))
          return
        }
      } catch {
        // fall back to local storage
      }

      const stored = localStorage.getItem('rahhalUser')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setUserDetails(parsed)
          setFormValues(parsed)
          return
        } catch {
          // ignore
        }
      }
    }

    loadProfile()
  }, [])

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

      const normalized = {
        fullName: payload?.name ?? formValues.fullName,
        email: payload?.email ?? formValues.email,
        phone: payload?.phone ?? formValues.phone,
      }

      setUserDetails(normalized)
      setFormValues(normalized)
      localStorage.setItem('rahhalUser', JSON.stringify(normalized))
      window.dispatchEvent(new Event('rahhal-user-change'))
      setIsEditing(false)
    } catch (err) {
      // fallback to local update on failure
      setUserDetails(formValues)
      localStorage.setItem('rahhalUser', JSON.stringify(formValues))
      window.dispatchEvent(new Event('rahhal-user-change'))
      setIsEditing(false)
    }
  }
  const toggleBookingDetails = (id) => {
    setExpandedBookings((prev) =>
      prev.includes(id) ? prev.filter((bookingId) => bookingId !== id) : [...prev, id]
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
      setRatingError('اختر عدد النجوم قبل الحفظ.')
      return
    }

    const trimmedComment = ratingComment.trim()
    if (trimmedComment.length < 6) {
      setRatingError('اكتب تعليقًا قصيرًا عن التجربة (6 أحرف على الأقل).')
      return
    }

    if (!/^\d+$/.test(String(ratingTarget.booking.id))) {
      setRatingError('رقم الحجز غير صالح. الرجاء تحديث الحجوزات لربطها بالقاعدة.')
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
      setRatingError(err?.message || 'تعذر حفظ التقييم الآن.')
    }
  }

  const isRatingModalOpen = Boolean(ratingTarget)
  const isViewMode = ratingMode === 'view'

  const setStarValue = (value) => {
    if (isViewMode) return
    setRatingValue(value)
  }

  return (
    <div className="profilePage" dir="rtl">
      <div className="profileMain">
        <header className="profileHeader" id="top">
          <p className="profileEyebrow">حسابي</p>
          <h1>الملف الشخصي</h1>
          <p className="profileSubtitle">إدارة معلوماتك وحجوزاتك بسهولة.</p>
        </header>

        <section className="profileInfoCard">
          {isEditing ? (
            <>
              <label className="profileField">
                <span>الاسم الكامل</span>
                <input
                  className="profileInput"
                  type="text"
                  value={formValues.fullName}
                  onChange={(event) => handleFieldChange('fullName', event.target.value)}
                />
              </label>
              <label className="profileField">
                <span>البريد الإلكتروني</span>
                <input
                  className="profileInput"
                  type="email"
                  value={formValues.email}
                  onChange={(event) => handleFieldChange('email', event.target.value)}
                />
              </label>
              <label className="profileField">
                <span>رقم الجوال</span>
                <input
                  className="profileInput"
                  type="tel"
                  value={formValues.phone}
                  onChange={(event) => handleFieldChange('phone', event.target.value)}
                />
              </label>
              <div className="profileActions">
                <button className="primaryBtn" type="button" onClick={handleSave}>
                  حفظ التغييرات
                </button>
                <button className="ghostBtn" type="button" onClick={handleCancel}>
                  إلغاء
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="profileInfoRow">
                <span>الاسم الكامل</span>
                <strong>{userDetails.fullName}</strong>
              </div>
              <div className="profileInfoRow">
                <span>البريد الإلكتروني</span>
                <strong>{userDetails.email}</strong>
              </div>
              <div className="profileInfoRow">
                <span>رقم الجوال</span>
                <strong>{userDetails.phone}</strong>
              </div>
              <button className="secondaryBtn profileEditBtn" type="button" onClick={handleEditToggle}>
                تعديل البيانات
              </button>
            </>
          )}
        </section>

        <section className="profileBookings" id="bookings">
          <div className="sectionHead">
            <h2 className="sectionTitle">حجوزاتي</h2>
            <p className="sectionSubtitle">تابع تفاصيل رحلاتك الحالية والسابقة.</p>
          </div>

          <div className="bookingsGrid">
            {bookings.map((booking) => {
              const trip = trips.find((item) => item.id === booking.tripId)
              const isMarkedCompleted = booking.status === 'completed'
              const review = reviews[booking.id]
              const showRatingCTA = isMarkedCompleted && !review
              return (
                <article className="bookingCard" key={booking.id}>
                  <div className="bookingImage">
                    <img src={trip?.image} alt={trip?.title} />
                    <span className={`bookingStatus ${booking.status}`}>
                      {statusCopy[booking.status] || booking.status}
                    </span>
                  </div>
                  <div className="bookingBody">
                    <div className="bookingTitle">
                      <h3>{trip?.title || 'رحلة غير محددة'}</h3>
                      <p>{trip?.city}</p>
                    </div>
                    <ul className="bookingMeta">
                      <li>
                        <span>التاريخ</span>
                        <strong>{formatDate(booking.date)}</strong>
                      </li>
                      <li>
                        <span>الوقت</span>
                        <strong>{formatTime(booking.time)}</strong>
                      </li>
                      <li>
                        <span>عدد الأشخاص</span>
                        <strong>{booking.people}</strong>
                      </li>
                    </ul>
                    <button
                      type="button"
                      className="secondaryBtn bookingDetailsBtn"
                      onClick={() => toggleBookingDetails(booking.id)}
                    >
                      عرض التفاصيل
                    </button>
                    {showRatingCTA ? (
                      <button
                        type="button"
                        className="primaryBtn bookingRateBtn"
                        onClick={() => openRatingModal(booking, trip)}
                      >
                        قيّم الرحلة
                      </button>
                    ) : null}
                    {review ? (
                      <button
                        type="button"
                        className="ghostBtn viewRatingBtn"
                        onClick={() => openRatingModal(booking, trip, { mode: 'view' })}
                      >
                        عرض التقييم
                      </button>
                    ) : null}
                    {expandedBookings.includes(booking.id) ? (
                      <div className="bookingExtra">
                        <div className={`barcodeWrapper ${isMarkedCompleted ? 'isExpired' : ''}`}>
                          <QrPlaceholder />
                          {isMarkedCompleted ? (
                            <div className="barcodeOverlay" aria-hidden="true">
                              <span className="barcodeTag">منتهية</span>
                            </div>
                          ) : null}
                        </div>
                        <p className="barcodeHint">يُستخدم هذا الباركود للتحقق من الحجز قبل الانطلاق.</p>
                      </div>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
      {isRatingModalOpen ? (
        <div className="ratingModalOverlay">
          <div className="ratingModal" role="dialog" aria-modal="true" aria-labelledby="rating-modal-title">
            <div className="ratingModalHead">
              <div>
                <p className="ratingEyebrow">قيّم الرحلة</p>
                <h3 id="rating-modal-title">{ratingTarget?.trip?.title || 'رحلتك'}</h3>
                <p className="ratingSub">{ratingTarget?.trip?.city}</p>
              </div>
              <button
                type="button"
                className="ghostBtn ratingCloseBtn"
                onClick={closeRatingModal}
                aria-label="إغلاق"
              >
                &times;
              </button>
            </div>
            <div className="ratingStarsInput" role="group" aria-label="التقييم بالنجوم">
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
                    aria-label={`تقييم ${value} من 5`}
                    disabled={isViewMode}
                  >
                    ★
                  </button>
                )
              })}
            </div>
            {isViewMode ? <p className="ratingViewHint">هذا تقييمك الحالي ولا يمكن تعديله.</p> : null}
            <label className="ratingField">
              <span>تعليق قصير عن التجربة</span>
              <textarea
                value={ratingComment}
                onChange={(event) => setRatingComment(event.target.value)}
                maxLength={320}
                rows={4}
                placeholder="اكتب لنا أجمل ما حدث خلال الرحلة..."
                className={`ratingTextarea ${isViewMode ? 'isReadOnly' : ''}`}
                readOnly={isViewMode}
              />
            </label>
            {!isViewMode && ratingError ? <p className="ratingError">{ratingError}</p> : null}
            <div className={`ratingModalActions ${isViewMode ? 'isViewMode' : ''}`}>
              {isViewMode ? (
                <button type="button" className="ghostBtn ratingDismissBtn isFull" onClick={closeRatingModal}>
                  إغلاق
                </button>
              ) : (
                <>
                  <button type="button" className="primaryBtn" onClick={handleRatingSubmit}>
                    حفظ التقييم
                  </button>
                  <button type="button" className="ghostBtn ratingDismissBtn" onClick={closeRatingModal}>
                    إغلاق
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Profile


