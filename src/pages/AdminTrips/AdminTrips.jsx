import { useCallback, useEffect, useMemo, useState } from 'react'
import '../Home/Home.css'
import '../TripsAvailable/TripsAvailable.css'
import './AdminTrips.css'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'

const PAGE_LIMIT = 12
const fallbackImage = '/src/assets/images/saudi-map1.png'

const defaultSummary = {
  totalTrips: 0,
  avgPrice: null,
  citiesCount: 0,
  availableSeats: 0,
  avgRating: null,
  resultsCount: 0,
}

const emptyForm = {
  title: '',
  destinationId: '',
  type: 'individual',
  description: '',
  startDate: '',
  endDate: '',
  durationDays: '',
  pricePerPerson: '',
  maxParticipants: '',
  status: 'draft',
  imageUrl: '',
}

const copy = {
  ar: {
    fallbackValue: '—',
    currency: 'ر.س',
    loadError: 'فشل في تحميل بيانات الرحلات',
    saveError: 'فشل حفظ بيانات الرحلة',
    deleteError: 'فشل حذف الرحلة',
    heroEyebrow: 'لوحة التحكم',
    heroTitle: 'إدارة الرحلات',
    heroSubtitle: 'تابع حالة الرحلات والملخصات مباشرة من النظام.',
    summary: {
      totalTrips: 'إجمالي الرحلات',
      cities: 'المدن',
      avgPrice: 'متوسط السعر',
      avgRating: 'متوسط التقييم',
      availableSeats: 'المقاعد المتاحة',
      filteredResults: 'نتائج بعد التصفية',
    },
    filters: {
      quickSearch: 'بحث سريع',
      searchPlaceholder: 'ابحث عن رحلة أو مدينة',
      city: 'المدينة',
      all: 'الكل',
      apply: 'تطبيق البحث',
      reset: 'إعادة التصفية',
      hint: 'يتم تطبيق الاسم أو المدينة مباشرة لإظهار النتائج.',
      listAria: 'قائمة الرحلات',
      filteredResults: (count) => `النتائج بعد التصفية: ${count} رحلة`,
      prevPage: 'الصفحة السابقة',
      nextPage: 'الصفحة التالية',
      pageOf: (page, totalPages) => `صفحة ${page} من ${totalPages}`,
    },
    states: {
      loadingTitle: 'جارٍ تحميل البيانات...',
      loadingHint: 'سيتم تحديث المعلومات خلال لحظات.',
      errorTitle: 'فشل تحميل بيانات الرحلات',
      retry: 'أعد المحاولة',
      emptyTitle: 'لا توجد نتائج مطابقة',
      emptyHint: 'جرّب تغيير كلمات البحث أو إعادة تعيين التصفية.',
    },
    form: {
      eyebrow: 'بيانات الرحلة',
      editTitle: 'تعديل الرحلة',
      createTitle: 'إضافة رحلة جديدة',
      editMeta: (id) => `معرّف الرحلة: ${id}`,
      createMeta: 'أدخل التفاصيل ليتم حفظ الرحلة.',
      cancelEdit: 'إلغاء التعديل',
      title: 'اسم الرحلة *',
      destination: 'الوجهة *',
      destinationPlaceholder: 'اختر الوجهة',
      type: 'نوع الرحلة *',
      status: 'حالة الرحلة *',
      price: 'السعر للشخص *',
      maxParticipants: 'عدد المشاركين *',
      duration: 'مدة الرحلة (أيام)',
      startDate: 'تاريخ البداية',
      endDate: 'تاريخ النهاية',
      description: 'الوصف',
      imageUrl: 'رابط الصورة (اختياري)',
      submitting: 'جاري الحفظ...',
      saveEdit: 'حفظ التعديلات',
      create: 'إضافة الرحلة',
      clear: 'تفريغ الحقول',
      requiredNote: 'الحقول بعلامة * إلزامية.',
    },
    validation: {
      title: 'يرجى إدخال اسم الرحلة.',
      destination: 'يرجى اختيار وجهة.',
      price: 'يرجى إدخال سعر صحيح.',
      maxParticipants: 'يرجى إدخال عدد المشاركين.',
      type: 'يرجى اختيار نوع الرحلة.',
      status: 'يرجى اختيار حالة الرحلة.',
      endDate: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية.',
      imageUrl: 'يرجى إدخال رابط صورة كامل يبدأ بـ http أو https.',
    },
    modal: {
      title: 'حذف الرحلة',
      description: (title) => `هل أنت متأكد من حذف رحلة "${title}"؟`,
      deleting: 'جارٍ الحذف...',
      confirm: 'حذف الرحلة',
      cancel: 'إلغاء',
    },
    card: {
      unknownDestination: 'غير محددة',
      days: (count) => `${count} أيام`,
      participants: (count) => `${count} مشارك`,
      type: 'النوع',
      status: 'الحالة',
      id: 'المعرّف',
      destinationId: 'وجهة',
      createdAt: 'أضيفت بتاريخ',
      edit: 'تعديل',
      delete: 'حذف',
    },
    statuses: {
      draft: 'مسودة',
      open: 'متاحة',
      full: 'مكتملة العدد',
      completed: 'منتهية',
      cancelled: 'ملغاة',
    },
    types: {
      individual: 'رحلة فردية',
      group: 'رحلة جماعية',
      school: 'رحلة مدرسية',
      ai: 'رحلة ذكاء اصطناعي',
    },
    regions: {
      central: 'المنطقة الوسطى',
      west: 'المنطقة الغربية',
      east: 'المنطقة الشرقية',
      north: 'المنطقة الشمالية',
      south: 'المنطقة الجنوبية',
    },
  },
  en: {
    fallbackValue: '—',
    currency: 'SAR',
    loadError: 'Failed to load trip data',
    saveError: 'Failed to save trip data',
    deleteError: 'Failed to delete the trip',
    heroEyebrow: 'Dashboard',
    heroTitle: 'Manage trips',
    heroSubtitle: 'Track trip status and summaries directly from the system.',
    summary: {
      totalTrips: 'Total trips',
      cities: 'Cities',
      avgPrice: 'Average price',
      avgRating: 'Average rating',
      availableSeats: 'Available seats',
      filteredResults: 'Filtered results',
    },
    filters: {
      quickSearch: 'Quick search',
      searchPlaceholder: 'Search by trip or city',
      city: 'City',
      all: 'All',
      apply: 'Apply search',
      reset: 'Reset filters',
      hint: 'Match by name or city to narrow the results.',
      listAria: 'Trips list',
      filteredResults: (count) => `${count} matching trips`,
      prevPage: 'Previous page',
      nextPage: 'Next page',
      pageOf: (page, totalPages) => `Page ${page} of ${totalPages}`,
    },
    states: {
      loadingTitle: 'Loading data...',
      loadingHint: 'The information will be updated shortly.',
      errorTitle: 'Failed to load trip data',
      retry: 'Retry',
      emptyTitle: 'No matching results',
      emptyHint: 'Try changing the search terms or resetting the filters.',
    },
    form: {
      eyebrow: 'Trip details',
      editTitle: 'Edit trip',
      createTitle: 'Add a new trip',
      editMeta: (id) => `Trip ID: ${id}`,
      createMeta: 'Enter the details to save the trip.',
      cancelEdit: 'Cancel editing',
      title: 'Trip name *',
      destination: 'Destination *',
      destinationPlaceholder: 'Choose a destination',
      type: 'Trip type *',
      status: 'Trip status *',
      price: 'Price per person *',
      maxParticipants: 'Participants count *',
      duration: 'Trip duration (days)',
      startDate: 'Start date',
      endDate: 'End date',
      description: 'Description',
      imageUrl: 'Image URL (optional)',
      submitting: 'Saving...',
      saveEdit: 'Save changes',
      create: 'Add trip',
      clear: 'Clear fields',
      requiredNote: 'Fields marked with * are required.',
    },
    validation: {
      title: 'Please enter the trip name.',
      destination: 'Please choose a destination.',
      price: 'Please enter a valid price.',
      maxParticipants: 'Please enter the participants count.',
      type: 'Please choose a trip type.',
      status: 'Please choose a trip status.',
      endDate: 'End date must be after the start date.',
      imageUrl: 'Please enter a full image URL that starts with http or https.',
    },
    modal: {
      title: 'Delete trip',
      description: (title) => `Are you sure you want to delete "${title}"?`,
      deleting: 'Deleting...',
      confirm: 'Delete trip',
      cancel: 'Cancel',
    },
    card: {
      unknownDestination: 'Not specified',
      days: (count) => `${count} days`,
      participants: (count) => `${count} participants`,
      type: 'Type',
      status: 'Status',
      id: 'ID',
      destinationId: 'Destination',
      createdAt: 'Created on',
      edit: 'Edit',
      delete: 'Delete',
    },
    statuses: {
      draft: 'Draft',
      open: 'Open',
      full: 'Full',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
    types: {
      individual: 'Individual trip',
      group: 'Group trip',
      school: 'School trip',
      ai: 'AI trip',
    },
    regions: {
      central: 'Central region',
      west: 'Western region',
      east: 'Eastern region',
      north: 'Northern region',
      south: 'Southern region',
    },
  },
}

const isHttpUrl = (value) => {
  if (!value) return false

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const mapSummary = (payload = {}) => ({
  totalTrips: Number(payload.totalTrips ?? 0),
  avgPrice:
    payload.avgPrice !== null && payload.avgPrice !== undefined
      ? Number(payload.avgPrice)
      : null,
  citiesCount: Number(payload.citiesCount ?? 0),
  availableSeats: Number(payload.availableSeats ?? 0),
  avgRating:
    payload.avgRating !== null && payload.avgRating !== undefined
      ? Number(payload.avgRating)
      : null,
  resultsCount: Number(payload.resultsCount ?? 0),
})

function AdminTrips() {
  const { language, dir } = useLanguage()
  const text = copy[language] ?? copy.ar
  const locale = language === 'ar' ? 'ar-SA' : 'en-US'

  const integerFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale],
  )
  const priceFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale],
  )
  const ratingFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [locale],
  )

  const formatInteger = useCallback(
    (value, fallback = '0') => {
      const number = Number(value ?? 0)
      return Number.isFinite(number) ? integerFormatter.format(number) : fallback
    },
    [integerFormatter],
  )

  const formatCurrency = useCallback(
    (value) => {
      if (value === null || value === undefined) return text.fallbackValue
      const number = Number(value)
      return Number.isFinite(number)
        ? `${priceFormatter.format(number)} ${text.currency}`
        : text.fallbackValue
    },
    [priceFormatter, text],
  )

  const formatRating = useCallback(
    (value) => {
      if (value === null || value === undefined) return text.fallbackValue
      const number = Number(value)
      return Number.isFinite(number) ? ratingFormatter.format(number) : text.fallbackValue
    },
    [ratingFormatter, text],
  )

  const formatDate = useCallback(
    (value) => {
      if (!value) return text.fallbackValue
      const date = new Date(value)
      return Number.isNaN(date.getTime()) ? text.fallbackValue : date.toLocaleDateString(locale)
    },
    [locale, text],
  )

  const statusLabels = useMemo(() => text.statuses, [text])
  const typeLabels = useMemo(() => text.types, [text])
  const regionLabels = useMemo(() => text.regions, [text])

  const statusOptions = useMemo(
    () => Object.entries(statusLabels).map(([value, label]) => ({ value, label })),
    [statusLabels],
  )
  const typeOptions = useMemo(
    () => Object.entries(typeLabels).map(([value, label]) => ({ value, label })),
    [typeLabels],
  )

  const [searchInput, setSearchInput] = useState('')
  const [query, setQuery] = useState('')
  const [destinationFilter, setDestinationFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [summary, setSummary] = useState(defaultSummary)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [destinations, setDestinations] = useState([])
  const [destinationsLoading, setDestinationsLoading] = useState(false)

  const [formData, setFormData] = useState({ ...emptyForm })
  const [formErrors, setFormErrors] = useState({})
  const [editingId, setEditingId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [openMenuId, setOpenMenuId] = useState(null)
  const [deleteTrip, setDeleteTrip] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchTrips = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_LIMIT),
      })
      if (query) params.set('q', query)
      if (destinationFilter !== 'all') params.set('destinationId', destinationFilter)

      const payload = await apiRequest(`/admin/trips?${params.toString()}`)
      setSummary(mapSummary(payload?.summary ?? defaultSummary))
      setItems(Array.isArray(payload?.items) ? payload.items : [])
    } catch (err) {
      setError(err?.message || text.loadError)
      setSummary(defaultSummary)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [destinationFilter, page, query, text.loadError])

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  useEffect(() => {
    let mounted = true

    const loadDestinations = async () => {
      setDestinationsLoading(true)
      try {
        const data = await apiRequest('/destinations')
        if (!mounted) return
        const list = (Array.isArray(data) ? data : []).map((destination) => ({
          id: destination.id?.toString() ?? '',
          name: destination.name ?? '',
          region: destination.region ?? '',
        }))
        setDestinations(list.filter((destination) => destination.id && destination.name))
      } catch {
        if (mounted) setDestinations([])
      } finally {
        if (mounted) setDestinationsLoading(false)
      }
    }

    loadDestinations()
    return () => {
      mounted = false
    }
  }, [])

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

  const summaryCards = useMemo(
    () => [
      { label: text.summary.totalTrips, value: formatInteger(summary.totalTrips) },
      { label: text.summary.cities, value: formatInteger(summary.citiesCount) },
      { label: text.summary.avgPrice, value: formatCurrency(summary.avgPrice) },
      { label: text.summary.avgRating, value: formatRating(summary.avgRating) },
      { label: text.summary.availableSeats, value: formatInteger(summary.availableSeats) },
      { label: text.summary.filteredResults, value: formatInteger(summary.resultsCount) },
    ],
    [formatCurrency, formatInteger, formatRating, summary, text.summary],
  )

  const destinationOptions = useMemo(
    () => [
      { value: 'all', label: text.filters.all },
      ...destinations.map((destination) => ({
        value: destination.id,
        label: destination.name,
      })),
    ],
    [destinations, text.filters.all],
  )

  const totalPages = Math.max(1, Math.ceil((summary.totalTrips || 0) / PAGE_LIMIT))
  const canGoPrev = page > 1
  const canGoNext = page < totalPages
  const isEditing = Boolean(editingId)

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setPage(1)
    setQuery(searchInput.trim())
  }

  const handleClearFilters = () => {
    setSearchInput('')
    setQuery('')
    setDestinationFilter('all')
    setPage(1)
  }

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: '', submit: '' }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = text.validation.title
    if (!formData.destinationId) errors.destinationId = text.validation.destination
    if (!formData.pricePerPerson || Number(formData.pricePerPerson) <= 0) {
      errors.pricePerPerson = text.validation.price
    }
    if (!formData.maxParticipants || Number(formData.maxParticipants) <= 0) {
      errors.maxParticipants = text.validation.maxParticipants
    }
    if (!formData.type) errors.type = text.validation.type
    if (!formData.status) errors.status = text.validation.status
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      errors.endDate = text.validation.endDate
    }
    if (formData.imageUrl.trim() && !isHttpUrl(formData.imageUrl.trim())) {
      errors.imageUrl = text.validation.imageUrl
    }
    return errors
  }

  const buildPayload = () => {
    const payload = {
      title: formData.title.trim(),
      destination_id: Number(formData.destinationId),
      type: formData.type,
      status: formData.status,
      price_per_person: Number(formData.pricePerPerson),
      max_participants: Number(formData.maxParticipants),
    }

    if (formData.description.trim()) payload.description = formData.description.trim()
    if (formData.startDate) payload.start_date = formData.startDate
    if (formData.endDate) payload.end_date = formData.endDate
    if (formData.durationDays) payload.duration_days = Number(formData.durationDays)
    if (formData.imageUrl.trim()) payload.image_url = formData.imageUrl.trim()

    return payload
  }

  const resetForm = () => {
    setEditingId('')
    setFormData({ ...emptyForm })
    setFormErrors({})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateForm()
    setFormErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    try {
      setSubmitting(true)
      const payload = buildPayload()
      if (isEditing) {
        await apiRequest(`/admin/trips/${editingId}`, {
          method: 'PATCH',
          body: payload,
        })
      } else {
        await apiRequest('/admin/trips', {
          method: 'POST',
          body: payload,
        })
      }
      await fetchTrips()
      resetForm()
      setPage(1)
    } catch (err) {
      setFormErrors((prev) => ({
        ...prev,
        submit: err?.message || text.saveError,
      }))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditTrip = (trip) => {
    setOpenMenuId(null)
    setEditingId(trip.id)
    setFormData({
      title: trip.title ?? '',
      destinationId: trip.destination_id ?? '',
      type: trip.type ?? 'individual',
      description: trip.description ?? '',
      startDate: trip.start_date ?? '',
      endDate: trip.end_date ?? '',
      durationDays: trip.duration_days ? String(trip.duration_days) : '',
      pricePerPerson:
        trip.price_per_person !== null && trip.price_per_person !== undefined
          ? String(trip.price_per_person)
          : '',
      maxParticipants:
        trip.max_participants !== null && trip.max_participants !== undefined
          ? String(trip.max_participants)
          : '',
      status: trip.status ?? 'draft',
      imageUrl: isHttpUrl(trip.image_url) ? trip.image_url : '',
    })
    setFormErrors({})
  }

  const handleDeleteRequest = (trip) => {
    setOpenMenuId(null)
    setDeleteTrip(trip)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTrip) return
    try {
      setDeleteLoading(true)
      await apiRequest(`/admin/trips/${deleteTrip.id}`, {
        method: 'DELETE',
      })
      setDeleteTrip(null)
      await fetchTrips()
    } catch (err) {
      setFormErrors((prev) => ({
        ...prev,
        submit: err?.message || text.deleteError,
      }))
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="home adminTripsPage" dir={dir}>
      <main className="adminTripsMain">
        <section className="adminHero">
          <div className="adminHeroText">
            <p className="adminEyebrow">{text.heroEyebrow}</p>
            <h1>{text.heroTitle}</h1>
            <p className="adminSubtitle">{text.heroSubtitle}</p>
          </div>
          <div className="adminHeroActions adminStatsGrid">
            {summaryCards.map((card) => (
              <div className="adminStat" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="adminLayout">
          <div className="adminColumn">
            <section className="adminToolbar">
              <form className="adminFilters" onSubmit={handleSearchSubmit}>
                <div className="field">
                  <label htmlFor="admin-search">{text.filters.quickSearch}</label>
                  <input
                    id="admin-search"
                    className="input"
                    type="search"
                    placeholder={text.filters.searchPlaceholder}
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="admin-city">{text.filters.city}</label>
                  <select
                    id="admin-city"
                    className="select"
                    value={destinationFilter}
                    onChange={(event) => {
                      setDestinationFilter(event.target.value)
                      setPage(1)
                    }}
                    disabled={destinationsLoading}
                  >
                    {destinationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="primaryBtn" type="submit">
                  {text.filters.apply}
                </button>
              </form>
              <div className="adminToolbarActions">
                <button className="filtersReset" type="button" onClick={handleClearFilters}>
                  {text.filters.reset}
                </button>
                <span className="adminToolbarHint">{text.filters.hint}</span>
              </div>
            </section>

            <section className="tripsGrid adminTripsGrid" aria-label={text.filters.listAria}>
              {loading ? (
                <div className="tripCard adminEmptyState">
                  <div className="tripBody">
                    <h3 className="tripTitle">{text.states.loadingTitle}</h3>
                    <p className="tripMeta">{text.states.loadingHint}</p>
                  </div>
                </div>
              ) : error ? (
                <div className="tripCard adminEmptyState">
                  <div className="tripBody">
                    <h3 className="tripTitle">{text.states.errorTitle}</h3>
                    <p className="tripMeta">{error}</p>
                    <button className="secondaryBtn" type="button" onClick={fetchTrips}>
                      {text.states.retry}
                    </button>
                  </div>
                </div>
              ) : items.length ? (
                items.map((trip) => (
                  <AdminTripCard
                    key={trip.id}
                    trip={trip}
                    menuOpen={openMenuId === trip.id}
                    onMenuToggle={setOpenMenuId}
                    onEdit={handleEditTrip}
                    onDelete={handleDeleteRequest}
                    text={text}
                    regionLabels={regionLabels}
                    typeLabels={typeLabels}
                    statusLabels={statusLabels}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                  />
                ))
              ) : (
                <div className="tripCard adminEmptyState">
                  <div className="tripBody">
                    <h3 className="tripTitle">{text.states.emptyTitle}</h3>
                    <p className="tripMeta">{text.states.emptyHint}</p>
                    <button className="secondaryBtn" type="button" onClick={handleClearFilters}>
                      {text.filters.reset}
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className="adminPagination">
              <div>
                <p className="adminToolbarHint">
                  {text.filters.filteredResults(formatInteger(summary.resultsCount))}
                </p>
              </div>
              <div className="adminPaginationActions">
                <button
                  className="secondaryBtn"
                  type="button"
                  onClick={() => canGoPrev && setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={!canGoPrev}
                >
                  {text.filters.prevPage}
                </button>
                <span className="adminToolbarHint">{text.filters.pageOf(page, totalPages)}</span>
                <button
                  className="secondaryBtn"
                  type="button"
                  onClick={() => canGoNext && setPage((prev) => prev + 1)}
                  disabled={!canGoNext}
                >
                  {text.filters.nextPage}
                </button>
              </div>
            </section>
          </div>

          <aside className="adminFormCard">
            <div className="adminFormHeader">
              <div>
                <p className="adminEyebrow">{text.form.eyebrow}</p>
                <h2>{isEditing ? text.form.editTitle : text.form.createTitle}</h2>
                <p className="adminFormMeta">
                  {isEditing ? text.form.editMeta(editingId) : text.form.createMeta}
                </p>
              </div>
              {isEditing ? (
                <button className="secondaryBtn" type="button" onClick={resetForm}>
                  {text.form.cancelEdit}
                </button>
              ) : null}
            </div>

            <form className="adminForm" onSubmit={handleSubmit}>
              <div className="adminFormGrid">
                <div className="field">
                  <label htmlFor="trip-title">{text.form.title}</label>
                  <input
                    id="trip-title"
                    className="input"
                    value={formData.title}
                    onChange={(event) => handleFormChange('title', event.target.value)}
                  />
                  {formErrors.title ? <span className="fieldError">{formErrors.title}</span> : null}
                </div>

                <div className="field">
                  <label htmlFor="trip-destination">{text.form.destination}</label>
                  <select
                    id="trip-destination"
                    className="select"
                    value={formData.destinationId}
                    onChange={(event) => handleFormChange('destinationId', event.target.value)}
                    disabled={destinationsLoading}
                  >
                    <option value="">{text.form.destinationPlaceholder}</option>
                    {destinations.map((destination) => (
                      <option key={destination.id} value={destination.id}>
                        {destination.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.destinationId ? (
                    <span className="fieldError">{formErrors.destinationId}</span>
                  ) : null}
                </div>

                <div className="field">
                  <label htmlFor="trip-type">{text.form.type}</label>
                  <select
                    id="trip-type"
                    className="select"
                    value={formData.type}
                    onChange={(event) => handleFormChange('type', event.target.value)}
                  >
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.type ? <span className="fieldError">{formErrors.type}</span> : null}
                </div>

                <div className="field">
                  <label htmlFor="trip-status">{text.form.status}</label>
                  <select
                    id="trip-status"
                    className="select"
                    value={formData.status}
                    onChange={(event) => handleFormChange('status', event.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.status ? <span className="fieldError">{formErrors.status}</span> : null}
                </div>

                <div className="field">
                  <label htmlFor="trip-price">{text.form.price}</label>
                  <input
                    id="trip-price"
                    className="input"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.pricePerPerson}
                    onChange={(event) => handleFormChange('pricePerPerson', event.target.value)}
                  />
                  {formErrors.pricePerPerson ? (
                    <span className="fieldError">{formErrors.pricePerPerson}</span>
                  ) : null}
                </div>

                <div className="field">
                  <label htmlFor="trip-max">{text.form.maxParticipants}</label>
                  <input
                    id="trip-max"
                    className="input"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.maxParticipants}
                    onChange={(event) => handleFormChange('maxParticipants', event.target.value)}
                  />
                  {formErrors.maxParticipants ? (
                    <span className="fieldError">{formErrors.maxParticipants}</span>
                  ) : null}
                </div>

                <div className="field">
                  <label htmlFor="trip-duration">{text.form.duration}</label>
                  <input
                    id="trip-duration"
                    className="input"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.durationDays}
                    onChange={(event) => handleFormChange('durationDays', event.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="trip-start">{text.form.startDate}</label>
                  <input
                    id="trip-start"
                    className="input"
                    type="date"
                    value={formData.startDate}
                    onChange={(event) => handleFormChange('startDate', event.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="trip-end">{text.form.endDate}</label>
                  <input
                    id="trip-end"
                    className="input"
                    type="date"
                    value={formData.endDate}
                    onChange={(event) => handleFormChange('endDate', event.target.value)}
                  />
                  {formErrors.endDate ? <span className="fieldError">{formErrors.endDate}</span> : null}
                </div>

                <div className="field full">
                  <label htmlFor="trip-description">{text.form.description}</label>
                  <textarea
                    id="trip-description"
                    className="input"
                    rows={3}
                    value={formData.description}
                    onChange={(event) => handleFormChange('description', event.target.value)}
                  />
                </div>

                <div className="field full">
                  <label htmlFor="trip-image">{text.form.imageUrl}</label>
                  <input
                    id="trip-image"
                    className="input"
                    value={formData.imageUrl}
                    onChange={(event) => handleFormChange('imageUrl', event.target.value)}
                  />
                  {formErrors.imageUrl ? <span className="fieldError">{formErrors.imageUrl}</span> : null}
                </div>
              </div>

              {formErrors.submit ? <p className="fieldError">{formErrors.submit}</p> : null}

              <div className="adminFormActions">
                <button className="primaryBtn" type="submit" disabled={submitting}>
                  {submitting
                    ? text.form.submitting
                    : isEditing
                      ? text.form.saveEdit
                      : text.form.create}
                </button>
                <button className="secondaryBtn" type="button" onClick={resetForm}>
                  {text.form.clear}
                </button>
              </div>
              <p className="adminFormNote">{text.form.requiredNote}</p>
            </form>
          </aside>
        </section>
      </main>

      {deleteTrip ? (
        <ConfirmModal
          title={text.modal.title}
          description={text.modal.description(deleteTrip.title)}
          confirmLabel={deleteLoading ? text.modal.deleting : text.modal.confirm}
          cancelLabel={text.modal.cancel}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTrip(null)}
          disabled={deleteLoading}
        />
      ) : null}
    </div>
  )
}

function AdminTripCard({
  trip,
  menuOpen,
  onMenuToggle,
  onEdit,
  onDelete,
  text,
  regionLabels,
  typeLabels,
  statusLabels,
  formatCurrency,
  formatDate,
}) {
  const menuId = `trip-menu-${trip.id}`
  const destinationName = trip.destination?.name ?? text.card.unknownDestination
  const regionLabel = regionLabels[trip.destination?.region] || trip.destination?.region || ''
  const typeLabel = typeLabels[trip.type] || trip.type
  const statusLabel = statusLabels[trip.status] || trip.status
  const durationLabel = trip.duration_days ? text.card.days(trip.duration_days) : null
  const priceLabel = formatCurrency(trip.price_per_person)
  const seatsLabel =
    trip.max_participants !== null && trip.max_participants !== undefined
      ? text.card.participants(trip.max_participants)
      : null
  const imageSrc =
    trip.display_image_url || trip.image_url || trip.destination?.image_url || fallbackImage

  return (
    <article className="tripCard adminTripCard" data-trip-menu={trip.id}>
      <div className="tripImg">
        <img src={imageSrc} alt={trip.title} loading="lazy" />
      </div>

      <div className="tripBody">
        <div className="tripHeader">
          <h3 className="tripTitle">{trip.title}</h3>
          <p className="tripLocation">{destinationName}</p>
        </div>

        <div className="tripMeta">
          {regionLabel ? <span className="tripMetaItem">{regionLabel}</span> : null}
          {durationLabel ? <span className="tripMetaItem">{durationLabel}</span> : null}
          <span className="tripMetaItem">{priceLabel}</span>
          {seatsLabel ? <span className="tripMetaItem">{seatsLabel}</span> : null}
        </div>

        <div className="adminTripMeta">
          <span>{text.card.type}: {typeLabel}</span>
          <span>{text.card.status}: {statusLabel}</span>
        </div>
        <div className="adminTripMeta">
          <span>{text.card.id}: {trip.id}</span>
          {trip.destination?.id ? <span>{text.card.destinationId}: {trip.destination.id}</span> : null}
        </div>
        <p className="tripMetaItem">
          {text.card.createdAt}: {formatDate(trip.created_at)}
        </p>
      </div>

      <div className="tripMenuWrapper">
        <button
          className="tripMenuBtn"
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => onMenuToggle((prev) => (prev === trip.id ? null : trip.id))}
        >
          ...
        </button>
        <div className={`tripMenu ${menuOpen ? 'open' : ''}`} id={menuId} role="menu">
          <button type="button" onClick={() => onEdit(trip)}>
            {text.card.edit}
          </button>
          <button type="button" className="danger" onClick={() => onDelete(trip)}>
            {text.card.delete}
          </button>
        </div>
      </div>
    </article>
  )
}

function ConfirmModal({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  disabled,
}) {
  return (
    <div className="adminModal" role="dialog" aria-modal="true">
      <div className="adminModalCard confirmCard">
        <h3>{title}</h3>
        <p className="modalDescription">{description}</p>
        <div className="adminModalActions">
          <button className="secondaryBtn" type="button" onClick={onCancel} disabled={disabled}>
            {cancelLabel}
          </button>
          <button className="primaryBtn danger" type="button" onClick={onConfirm} disabled={disabled}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminTrips
