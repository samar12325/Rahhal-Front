import { useEffect, useMemo, useState } from 'react'
import '../Home/Home.css'
import '../TripsAvailable/TripsAvailable.css'
import './AdminTrips.css'
import Footer from '../Home/components/Footer'
import { createTripId, loadTrips, saveTrips } from '../../data/trips.store'

const emptyDraft = {
  title: '',
  city: '',
  durationLabel: '',
  price: '',
  rating: '',
  seats: '',
  destinationId: '',
  activityId: '',
  image: '',
  tags: '',
  badges: '',
}

const toDraft = (trip) => ({
  title: trip.title ?? '',
  city: trip.city ?? '',
  durationLabel: trip.durationLabel ?? '',
  price: trip.price?.toString() ?? '',
  rating: trip.rating?.toString() ?? '',
  seats: trip.seats?.toString() ?? '',
  destinationId: trip.destinationId ?? '',
  activityId: trip.activityId ?? '',
  image: trip.image ?? '',
  tags: Array.isArray(trip.tags) ? trip.tags.join('، ') : '',
  badges: Array.isArray(trip.badges) ? trip.badges.join('، ') : '',
})

const parseList = (value) =>
  value
    .split(/[,،]/)
    .map((item) => item.trim())
    .filter(Boolean)

const buildTrip = (draft, id) => {
  const destinationId = draft.destinationId.trim()
  const activityId = draft.activityId.trim()
  const ratingText = draft.rating.trim()
  const seatsText = draft.seats.trim()

  const nextTrip = {
    id,
    title: draft.title.trim(),
    city: draft.city.trim(),
    durationLabel: draft.durationLabel.trim(),
    price: Number(draft.price),
    image: draft.image.trim(),
    tags: parseList(draft.tags),
    badges: parseList(draft.badges),
  }

  if (destinationId) nextTrip.destinationId = destinationId
  if (activityId) nextTrip.activityId = activityId
  if (ratingText) nextTrip.rating = Number(ratingText)
  if (seatsText) nextTrip.seats = Number(seatsText)

  return nextTrip
}

const validateDraft = (draft) => {
  const nextErrors = {}
  const priceValue = Number(draft.price)
  const ratingValue = draft.rating.trim() ? Number(draft.rating) : null
  const seatsValue = draft.seats.trim() ? Number(draft.seats) : null

  if (!draft.title.trim()) nextErrors.title = 'يرجى إدخال اسم الرحلة.'
  if (!draft.city.trim()) nextErrors.city = 'يرجى إدخال المدينة.'
  if (!draft.durationLabel.trim()) nextErrors.durationLabel = 'يرجى إدخال مدة الرحلة.'
  if (!draft.image.trim()) nextErrors.image = 'أضف رابط صورة الرحلة.'

  if (!draft.price.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
    nextErrors.price = 'يرجى إدخال السعر بشكل صحيح.'
  }

  if (ratingValue !== null && (Number.isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5)) {
    nextErrors.rating = 'التقييم يجب أن يكون بين 0 و 5.'
  }

  if (seatsValue !== null && (Number.isNaN(seatsValue) || seatsValue < 1)) {
    nextErrors.seats = 'عدد المقاعد يجب أن يكون 1 أو أكثر.'
  }

  return nextErrors
}

function AdminTrips() {
  const [trips, setTrips] = useState(() => loadTrips())
  const [query, setQuery] = useState('')
  const [cityFilter, setCityFilter] = useState('الكل')
  const [editingId, setEditingId] = useState('')
  const [draft, setDraft] = useState(() => ({ ...emptyDraft }))
  const [errors, setErrors] = useState({})
  const [openMenuId, setOpenMenuId] = useState(null)
  const [previewTrip, setPreviewTrip] = useState(null)
  const [deleteTrip, setDeleteTrip] = useState(null)

  useEffect(() => {
    saveTrips(trips)
  }, [trips])

  useEffect(() => {
    if (!openMenuId) return

    const handleClick = (event) => {
      if (!(event.target instanceof Element)) return
      if (event.target.closest(`[data-trip-menu="${openMenuId}"]`)) return
      setOpenMenuId(null)
    }

    const handleKey = (event) => {
      if (event.key === 'Escape') setOpenMenuId(null)
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [openMenuId])

  const cities = useMemo(() => {
    const list = Array.from(new Set(trips.map((trip) => trip.city).filter(Boolean)))
    return ['الكل', ...list]
  }, [trips])

  const filteredTrips = useMemo(() => {
    let list = [...trips]
    const q = query.trim().toLowerCase()

    if (q) {
      list = list.filter((trip) => `${trip.title} ${trip.city}`.toLowerCase().includes(q))
    }

    if (cityFilter !== 'الكل') {
      list = list.filter((trip) => trip.city === cityFilter)
    }

    return list
  }, [trips, query, cityFilter])

  const stats = useMemo(() => {
    const totalTrips = trips.length
    const cityCount = new Set(trips.map((trip) => trip.city).filter(Boolean)).size
    const totalSeats = trips.reduce((sum, trip) => sum + (Number(trip.seats) || 0), 0)
    const totalPrice = trips.reduce((sum, trip) => sum + (Number(trip.price) || 0), 0)
    const averagePrice = totalTrips ? Math.round(totalPrice / totalTrips) : 0
    const ratingList = trips.map((trip) => Number(trip.rating)).filter((value) => !Number.isNaN(value))
    const averageRating = ratingList.length
      ? (ratingList.reduce((sum, value) => sum + value, 0) / ratingList.length).toFixed(1)
      : '—'

    return {
      totalTrips,
      cityCount,
      totalSeats,
      averagePrice,
      averageRating,
      filteredCount: filteredTrips.length,
    }
  }, [trips, filteredTrips.length])

  const isEditing = Boolean(editingId)

  const handleMenuToggle = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id))
  }

  const handleDraftChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleEditTrip = (trip) => {
    setDraft(toDraft(trip))
    setEditingId(trip.id)
    setErrors({})
    setOpenMenuId(null)
  }

  const handlePreviewTrip = (trip) => {
    setPreviewTrip(trip)
    setOpenMenuId(null)
  }

  const handleDeleteRequest = (trip) => {
    setDeleteTrip(trip)
    setOpenMenuId(null)
  }

  const handleDeleteConfirm = () => {
    if (!deleteTrip) return
    setTrips((prev) => prev.filter((trip) => trip.id !== deleteTrip.id))
    setDeleteTrip(null)
    if (editingId === deleteTrip.id) {
      setEditingId('')
      setDraft({ ...emptyDraft })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validateDraft(draft)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    const existingIds = new Set(trips.map((trip) => trip.id))
    const nextId = isEditing ? editingId : createTripId(existingIds)
    const nextTrip = buildTrip(draft, nextId)

    setTrips((prev) => {
      if (isEditing) {
        return prev.map((trip) => (trip.id === editingId ? nextTrip : trip))
      }
      return [nextTrip, ...prev]
    })

    setEditingId('')
    setDraft({ ...emptyDraft })
  }

  const handleResetForm = () => {
    setEditingId('')
    setDraft({ ...emptyDraft })
    setErrors({})
  }

  const handleClearFilters = () => {
    setQuery('')
    setCityFilter('الكل')
  }

  return (
    <div className="home adminTripsPage" dir="rtl">
      <main className="adminTripsMain">
        <section className="adminHero">
          <div className="adminHeroText">
            <p className="adminEyebrow">لوحة التحكم</p>
            <h1>إدارة الرحلات</h1>
            <p className="adminSubtitle">أضف، حدّث أو احذف الرحلات مع حفظ محلي فوري.</p>
          </div>
          <div className="adminHeroActions adminStatsGrid">
            <div className="adminStat">
              <span>إجمالي الرحلات</span>
              <strong>{stats.totalTrips}</strong>
            </div>
            <div className="adminStat">
              <span>المدن</span>
              <strong>{stats.cityCount}</strong>
            </div>
            <div className="adminStat">
              <span>متوسط السعر</span>
              <strong>{stats.averagePrice} ر.س</strong>
            </div>
            <div className="adminStat">
              <span>متوسط التقييم</span>
              <strong>{stats.averageRating}</strong>
            </div>
            <div className="adminStat">
              <span>المقاعد المتاحة</span>
              <strong>{stats.totalSeats}</strong>
            </div>
            <div className="adminStat">
              <span>نتائج البحث</span>
              <strong>{stats.filteredCount}</strong>
            </div>
          </div>
        </section>

        <section className="adminLayout">
          <div className="adminColumn">
            <section className="adminToolbar">
              <div className="adminFilters">
                <div className="field">
                  <label htmlFor="admin-search">بحث سريع</label>
                  <input
                    id="admin-search"
                    className="input"
                    type="search"
                    placeholder="ابحث عن رحلة أو مدينة"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="admin-city">المدينة</label>
                  <select
                    id="admin-city"
                    className="select"
                    value={cityFilter}
                    onChange={(event) => setCityFilter(event.target.value)}
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="adminToolbarActions">
                <button className="filtersReset" type="button" onClick={handleClearFilters}>
                  إعادة التصفية
                </button>
                <span className="adminToolbarHint">يمكنك إدارة جميع الرحلات من هنا.</span>
              </div>
            </section>

            <section className="tripsGrid adminTripsGrid" aria-label="قائمة الرحلات">
              {filteredTrips.length ? (
                filteredTrips.map((trip) => (
                  <AdminTripCard
                    key={trip.id}
                    trip={trip}
                    menuOpen={openMenuId === trip.id}
                    onMenuToggle={handleMenuToggle}
                    onPreview={handlePreviewTrip}
                    onEdit={handleEditTrip}
                    onDelete={handleDeleteRequest}
                  />
                ))
              ) : (
                <div className="tripCard adminEmptyState">
                  <div className="tripBody">
                    <h3 className="tripTitle">لا توجد نتائج مطابقة</h3>
                    <p className="tripMeta">جرّب تغيير كلمات البحث أو إعادة تعيين التصفية.</p>
                    <button className="secondaryBtn" type="button" onClick={handleClearFilters}>
                      إعادة التصفية
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="adminFormCard">
            <div className="adminFormHeader">
              <div>
                <p className="adminEyebrow">بيانات الرحلة</p>
                <h2>{isEditing ? 'تعديل الرحلة' : 'إضافة رحلة جديدة'}</h2>
                <p className="adminFormMeta">
                  {isEditing ? `معرّف الرحلة: ${editingId}` : 'أضف تفاصيل الرحلة ليتم حفظها ضمن القائمة.'}
                </p>
              </div>
              {isEditing ? (
                <button className="secondaryBtn" type="button" onClick={handleResetForm}>
                  إلغاء التعديل
                </button>
              ) : null}
            </div>

            <form className="adminForm" onSubmit={handleSubmit}>
              <div className="adminFormGrid">
                <div className="field">
                  <label htmlFor="trip-title">اسم الرحلة *</label>
                  <input
                    id="trip-title"
                    className="input"
                    value={draft.title}
                    onChange={(event) => handleDraftChange('title', event.target.value)}
                  />
                  {errors.title ? <span className="fieldError">{errors.title}</span> : null}
                </div>
                <div className="field">
                  <label htmlFor="trip-city">المدينة *</label>
                  <input
                    id="trip-city"
                    className="input"
                    value={draft.city}
                    onChange={(event) => handleDraftChange('city', event.target.value)}
                  />
                  {errors.city ? <span className="fieldError">{errors.city}</span> : null}
                </div>
                <div className="field">
                  <label htmlFor="trip-duration">مدة الرحلة *</label>
                  <input
                    id="trip-duration"
                    className="input"
                    placeholder="مثال: 3 أيام"
                    value={draft.durationLabel}
                    onChange={(event) => handleDraftChange('durationLabel', event.target.value)}
                  />
                  {errors.durationLabel ? (
                    <span className="fieldError">{errors.durationLabel}</span>
                  ) : null}
                </div>
                <div className="field">
                  <label htmlFor="trip-price">السعر *</label>
                  <input
                    id="trip-price"
                    className="input"
                    type="number"
                    min="1"
                    step="1"
                    value={draft.price}
                    onChange={(event) => handleDraftChange('price', event.target.value)}
                  />
                  {errors.price ? <span className="fieldError">{errors.price}</span> : null}
                </div>
                <div className="field">
                  <label htmlFor="trip-rating">التقييم</label>
                  <input
                    id="trip-rating"
                    className="input"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={draft.rating}
                    onChange={(event) => handleDraftChange('rating', event.target.value)}
                  />
                  {errors.rating ? <span className="fieldError">{errors.rating}</span> : null}
                </div>
                <div className="field">
                  <label htmlFor="trip-seats">عدد المقاعد</label>
                  <input
                    id="trip-seats"
                    className="input"
                    type="number"
                    min="1"
                    step="1"
                    value={draft.seats}
                    onChange={(event) => handleDraftChange('seats', event.target.value)}
                  />
                  {errors.seats ? <span className="fieldError">{errors.seats}</span> : null}
                </div>
                <div className="field">
                  <label htmlFor="trip-destination">destinationId</label>
                  <input
                    id="trip-destination"
                    className="input"
                    placeholder="مثال: alula"
                    value={draft.destinationId}
                    onChange={(event) => handleDraftChange('destinationId', event.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="trip-activity">activityId</label>
                  <input
                    id="trip-activity"
                    className="input"
                    placeholder="مثال: madaen-saleh-tour"
                    value={draft.activityId}
                    onChange={(event) => handleDraftChange('activityId', event.target.value)}
                  />
                </div>
                <div className="field full">
                  <label htmlFor="trip-image">صورة الرحلة *</label>
                  <input
                    id="trip-image"
                    className="input"
                    placeholder="ضع رابط الصورة هنا"
                    value={draft.image}
                    onChange={(event) => handleDraftChange('image', event.target.value)}
                  />
                  {errors.image ? <span className="fieldError">{errors.image}</span> : null}
                </div>
                <div className="field full">
                  <label htmlFor="trip-tags">الوسوم</label>
                  <input
                    id="trip-tags"
                    className="input"
                    placeholder="مثال: مغامرة، ثقافية، عائلية"
                    value={draft.tags}
                    onChange={(event) => handleDraftChange('tags', event.target.value)}
                  />
                </div>
                <div className="field full">
                  <label htmlFor="trip-badges">الشارات</label>
                  <input
                    id="trip-badges"
                    className="input"
                    placeholder="مثال: جديدة، الأكثر مبيعًا"
                    value={draft.badges}
                    onChange={(event) => handleDraftChange('badges', event.target.value)}
                  />
                </div>
              </div>

              <div className="adminFormActions">
                <button className="primaryBtn" type="submit">
                  {isEditing ? 'حفظ التعديلات' : 'إضافة الرحلة'}
                </button>
                <button className="secondaryBtn" type="button" onClick={handleResetForm}>
                  تفريغ الحقول
                </button>
              </div>
              <p className="adminFormNote">الحقول بعلامة * إلزامية.</p>
            </form>
          </aside>
        </section>
      </main>
      <Footer />

      {previewTrip ? (
        <PreviewModal trip={previewTrip} onClose={() => setPreviewTrip(null)} />
      ) : null}

      {deleteTrip ? (
        <ConfirmModal
          title="حذف الرحلة"
          description={`هل أنت متأكد من حذف رحلة "${deleteTrip.title}"؟`}
          confirmLabel="حذف الرحلة"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTrip(null)}
        />
      ) : null}
    </div>
  )
}

function AdminTripCard({ trip, menuOpen, onMenuToggle, onPreview, onEdit, onDelete }) {
  const menuId = `trip-menu-${trip.id}`

  return (
    <article className="tripCard adminTripCard">
      <div className="tripImg">
        <img src={trip.image} alt={trip.title} />
      </div>

      <div className="tripBody">
        <div className="tripHeader">
          <h3 className="tripTitle">{trip.title}</h3>
          <p className="tripLocation">{trip.city}</p>
        </div>

        <div className="tripMeta">
          <span className="tripMetaItem">{trip.durationLabel}</span>
          <span className="tripMetaItem">{trip.price} ر.س</span>
          {trip.seats ? <span className="tripMetaItem">المقاعد {trip.seats}</span> : null}
        </div>

        {trip.badges?.length ? (
          <div className="tags">
            {trip.badges.slice(0, 3).map((badge) => (
              <span className="tag" key={badge}>
                {badge}
              </span>
            ))}
          </div>
        ) : null}

        <div className="adminTripMeta">
          <span>المعرف: {trip.id}</span>
          {trip.destinationId ? <span>وجهة: {trip.destinationId}</span> : null}
        </div>
      </div>

      <div className="tripMenuWrapper" data-trip-menu={trip.id}>
        <button
          className="tripMenuBtn"
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => onMenuToggle(trip.id)}
        >
          ...
        </button>
        <div className={`tripMenu ${menuOpen ? 'open' : ''}`} id={menuId} role="menu">
          <button type="button" onClick={() => onPreview(trip)}>
            معاينة
          </button>
          <button type="button" onClick={() => onEdit(trip)}>
            تعديل
          </button>
          <button type="button" className="danger" onClick={() => onDelete(trip)}>
            حذف
          </button>
        </div>
      </div>
    </article>
  )
}

function PreviewModal({ trip, onClose }) {
  return (
    <div className="adminModal" role="dialog" aria-modal="true">
      <div className="adminModalCard previewCard">
        <button className="modalClose" type="button" onClick={onClose} aria-label="إغلاق">
          ×
        </button>
        <div className="previewMedia">
          <img src={trip.image} alt={trip.title} />
        </div>
        <div className="previewContent">
          <p className="adminEyebrow">تفاصيل الرحلة</p>
          <h2>{trip.title}</h2>
          <p className="previewCity">{trip.city}</p>
          <div className="previewMeta">
            <span>المدة: {trip.durationLabel}</span>
            <span>السعر: {trip.price} ر.س</span>
            {trip.rating ? <span>التقييم: {trip.rating}</span> : null}
            {trip.seats ? <span>المقاعد: {trip.seats}</span> : null}
          </div>
          {trip.tags?.length ? (
            <div className="tags">
              {trip.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ConfirmModal({ title, description, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="adminModal" role="dialog" aria-modal="true">
      <div className="adminModalCard confirmCard">
        <h3>{title}</h3>
        <p className="modalDescription">{description}</p>
        <div className="adminModalActions">
          <button className="secondaryBtn" type="button" onClick={onCancel}>
            إلغاء
          </button>
          <button className="primaryBtn danger" type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminTrips
