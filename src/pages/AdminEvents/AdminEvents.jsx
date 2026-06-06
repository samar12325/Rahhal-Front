import { useCallback, useEffect, useMemo, useState } from 'react'
import '../Home/Home.css'
import '../TripsAvailable/TripsAvailable.css'
import '../AdminTrips/AdminTrips.css'
import './AdminEvents.css'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'

const PAGE_LIMIT = 12
const fallbackImage = '/src/assets/images/saudi-map1.png'

const copy = {
  ar: {
    statusOptions: {
      active: 'نشطة',
      inactive: 'غير نشطة',
    },
    hero: {
      eyebrow: 'لوحة التحكم',
      title: 'إدارة الفعاليات',
      subtitle: 'إضافة الفعاليات وتحديثها وتعطيلها مع روابط الحجز الرسمية.',
    },
    summary: {
      totalEvents: 'إجمالي الفعاليات',
      activeEvents: 'الفعاليات النشطة',
      categoriesCount: 'التصنيفات',
      citiesCount: 'المدن',
      resultsCount: 'نتائج التصفية',
    },
    filters: {
      searchLabel: 'بحث سريع',
      searchPlaceholder: 'ابحث باسم الفعالية أو المدينة أو التصنيف',
      statusLabel: 'الحالة',
      all: 'الكل',
      apply: 'تطبيق البحث',
    },
    table: {
      title: 'جدول الفعاليات',
      add: 'إضافة فعالية',
      loading: 'جارٍ تحميل البيانات...',
      empty: 'لا توجد فعاليات مطابقة.',
      columns: {
        event: 'الفعالية',
        city: 'المدينة',
        category: 'التصنيف',
        date: 'التاريخ',
        status: 'الحالة',
        booking: 'الحجز',
        actions: 'الإجراءات',
      },
      bookingAvailable: 'متوفر',
      bookingUnavailable: 'غير متوفر',
      edit: 'تعديل',
      deactivate: 'تعطيل',
    },
    pagination: {
      previous: 'الصفحة السابقة',
      next: 'الصفحة التالية',
      summary: 'صفحة {{page}} من {{total}}',
    },
    form: {
      eyebrow: 'بيانات الفعالية',
      createTitle: 'إضافة فعالية',
      editTitle: 'تعديل فعالية',
      cancelEdit: 'إلغاء التعديل',
      fields: {
        title: 'اسم الفعالية *',
        city: 'المدينة *',
        location: 'الموقع *',
        category: 'التصنيف *',
        priceText: 'السعر التقريبي',
        status: 'الحالة',
        startDatetime: 'تاريخ البداية *',
        endDatetime: 'تاريخ النهاية',
        description: 'الوصف',
        imageUrl: 'الصورة',
        officialBookingUrl: 'رابط الحجز الرسمي',
      },
      actions: {
        create: 'إضافة فعالية',
        save: 'حفظ التعديلات',
        submitting: 'جارٍ الحفظ...',
        reset: 'تفريغ الحقول',
      },
      errors: {
        loadFailed: 'فشل تحميل بيانات الفعاليات',
        submitFailed: 'فشل حفظ بيانات الفعالية',
        deactivateFailed: 'فشل تعطيل الفعالية',
        title: 'يرجى إدخال اسم الفعالية.',
        city: 'يرجى إدخال المدينة.',
        location: 'يرجى إدخال الموقع.',
        category: 'يرجى إدخال التصنيف.',
        startDatetime: 'يرجى إدخال تاريخ البداية.',
        endDatetime: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية.',
        imageUrl: 'رابط الصورة يجب أن يبدأ بـ http أو https.',
        officialBookingUrl: 'رابط الحجز يجب أن يبدأ بـ http أو https.',
      },
    },
    modal: {
      title: 'تعطيل الفعالية',
      description: 'سيتم جعل الفعالية غير نشطة ولن تظهر للمستخدمين. هل تريد المتابعة؟',
      cancel: 'إلغاء',
      confirm: 'تعطيل الفعالية',
      loading: 'جارٍ التعطيل...',
    },
    misc: {
      dash: '-',
      currency: 'ر.س',
    },
  },
  en: {
    statusOptions: {
      active: 'Active',
      inactive: 'Inactive',
    },
    hero: {
      eyebrow: 'Control panel',
      title: 'Manage events',
      subtitle: 'Create, update, and deactivate events and their official booking links.',
    },
    summary: {
      totalEvents: 'Total events',
      activeEvents: 'Active events',
      categoriesCount: 'Categories',
      citiesCount: 'Cities',
      resultsCount: 'Filtered results',
    },
    filters: {
      searchLabel: 'Quick search',
      searchPlaceholder: 'Search by event name, city, or category',
      statusLabel: 'Status',
      all: 'All',
      apply: 'Apply search',
    },
    table: {
      title: 'Events table',
      add: 'Add event',
      loading: 'Loading data...',
      empty: 'No matching events found.',
      columns: {
        event: 'Event',
        city: 'City',
        category: 'Category',
        date: 'Date',
        status: 'Status',
        booking: 'Booking',
        actions: 'Actions',
      },
      bookingAvailable: 'Available',
      bookingUnavailable: 'Unavailable',
      edit: 'Edit',
      deactivate: 'Deactivate',
    },
    pagination: {
      previous: 'Previous page',
      next: 'Next page',
      summary: 'Page {{page}} of {{total}}',
    },
    form: {
      eyebrow: 'Event details',
      createTitle: 'Add event',
      editTitle: 'Edit event',
      cancelEdit: 'Cancel editing',
      fields: {
        title: 'Event name *',
        city: 'City *',
        location: 'Location *',
        category: 'Category *',
        priceText: 'Approximate price',
        status: 'Status',
        startDatetime: 'Start date *',
        endDatetime: 'End date',
        description: 'Description',
        imageUrl: 'Image',
        officialBookingUrl: 'Official booking URL',
      },
      actions: {
        create: 'Add event',
        save: 'Save changes',
        submitting: 'Saving...',
        reset: 'Clear fields',
      },
      errors: {
        loadFailed: 'Failed to load event data',
        submitFailed: 'Failed to save event data',
        deactivateFailed: 'Failed to deactivate the event',
        title: 'Please enter the event name.',
        city: 'Please enter the city.',
        location: 'Please enter the location.',
        category: 'Please enter the category.',
        startDatetime: 'Please enter the start date.',
        endDatetime: 'End date must be after the start date.',
        imageUrl: 'Image URL must start with http or https.',
        officialBookingUrl: 'Booking URL must start with http or https.',
      },
    },
    modal: {
      title: 'Deactivate event',
      description: 'The event will be marked inactive and hidden from users. Do you want to continue?',
      cancel: 'Cancel',
      confirm: 'Deactivate event',
      loading: 'Deactivating...',
    },
    misc: {
      dash: '-',
      currency: 'SAR',
    },
  },
}

const eventTranslations = {
  en: {
    titles: {
      'تجربة البلدة القديمة في العلا': 'Old Town AlUla experience',
      'جولة قرية رجال ألمع': 'Rijal Almaa village tour',
      'جولة سوق القيصرية': 'Qaisariyah Souq tour',
      'مزارع النخيل في تبوك': 'Tabuk palm farms',
      'جولة قلعة تبوك': 'Tabuk Castle tour',
      'بوليفارد رياض سيتي': 'Boulevard Riyadh City',
      'جولة جبل الفيل': 'Elephant Rock tour',
      'واجهة الدمام البحرية': 'Dammam waterfront',
      'جولة الدرعية التاريخية': 'Historic Diriyah tour',
      'جولة البلد التاريخية': 'Historic Al Balad tour',
      'مغامرة السودة': 'Al Soudah adventure',
      'موسم جدة': 'Jeddah Season',
    },
    cities: {
      العلا: 'AlUla',
      أبها: 'Abha',
      الدمام: 'Dammam',
      تبوك: 'Tabuk',
      الرياض: 'Riyadh',
      جدة: 'Jeddah',
    },
    locations: {
      'البلدة القديمة': 'Old Town',
      'رجال ألمع': 'Rijal Almaa',
      'سوق القيصرية - الأحساء': 'Qaisariyah Souq - Al Ahsa',
      تبوك: 'Tabuk',
      'قلعة تبوك': 'Tabuk Castle',
      'بوليفارد رياض سيتي': 'Boulevard Riyadh City',
      'جبل الفيل': 'Elephant Rock',
      'كورنيش الدمام': 'Dammam Corniche',
      الدرعية: 'Diriyah',
      'جدة التاريخية - البلد': 'Historic Jeddah - Al Balad',
      السودة: 'Al Soudah',
      'واجهة جدة البحرية': 'Jeddah Waterfront',
    },
    categories: {
      'ثقافة وتراث': 'Culture and heritage',
      'ثقافة وتسوق': 'Culture and shopping',
      طبيعة: 'Nature',
      ترفيه: 'Entertainment',
      'طبيعة ومغامرات': 'Nature and adventure',
    },
    descriptions: {
      'تجربة سياحية في البلدة القديمة بالعلا للتعرف على التاريخ والمعالم التراثية.':
        'A heritage experience in AlUla Old Town to explore its history and landmarks.',
      'زيارة تراثية لقرية رجال ألمع والتعرف على العمارة الجنوبية والمتحف المحلي.':
        'A heritage visit to Rijal Almaa village to discover southern architecture and the local museum.',
      'تجربة تراثية وتسوق شعبي في أحد أشهر الأسواق القديمة في المنطقة الشرقية.':
        'A heritage and shopping experience in one of the Eastern Province most famous historic markets.',
      'تجربة هادئة للتعرف على الطبيعة والمزارع المحلية في تبوك.':
        'A calm outing to discover nature and local farms in Tabuk.',
      'زيارة تاريخية لقلعة تبوك والتعرف على أهميتها التراثية.':
        'A historical visit to Tabuk Castle and its heritage significance.',
      'منطقة ترفيهية تضم مطاعم ومقاهي وتجارب وأنشطة مناسبة للعائلات والشباب.':
        'An entertainment district with restaurants, cafes, experiences, and activities for families and young adults.',
      'زيارة طبيعية لأحد أشهر المعالم الصخرية في العلا مع جلسات تصوير وتجربة خارجية.':
        'An outdoor visit to one of AlUla most iconic rock landmarks, with photo stops and open-air experiences.',
      'تجربة عائلية على الواجهة البحرية تشمل جلسات ومطاعم وممشى.':
        'A family-friendly waterfront experience with seating areas, restaurants, and a promenade.',
      'تجربة ثقافية للتعرف على تاريخ الدرعية والمباني التراثية والأسواق الشعبية.':
        'A cultural experience to explore Diriyah history, heritage buildings, and traditional markets.',
      'جولة بين المباني التاريخية والأسواق القديمة في منطقة البلد.':
        'A walk through the historic buildings and old markets of Al Balad.',
      'تجربة جبلية في أجواء أبها تشمل مناظر طبيعية وأنشطة خارجية.':
        'A mountain experience in Abha with scenic views and outdoor activities.',
      'فعاليات ترفيهية ومطاعم وتجارب بحرية في مدينة جدة.':
        'Entertainment events, dining, and seaside experiences across Jeddah.',
    },
    prices: {
      'يبدأ من 70 ريال': 'Starts from 70 SAR',
      'يبدأ من 30 ريال': 'Starts from 30 SAR',
      مجاني: 'Free',
      'حسب الجولة': 'Depends on the tour',
      'حسب الفعالية': 'Depends on the event',
      'يبدأ من 50 ريال': 'Starts from 50 SAR',
      'مجاني / حسب الجولة': 'Free / depends on the tour',
      'حسب النشاط': 'Depends on the activity',
    },
  },
}

const emptyForm = {
  title: '',
  city: '',
  location: '',
  category: '',
  description: '',
  imageUrl: '',
  priceText: '',
  startDatetime: '',
  endDatetime: '',
  officialBookingUrl: '',
  status: 'active',
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

const toInputDateTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

const translateEventValue = (language, field, value) => {
  if (!value || language === 'ar') return value
  return eventTranslations[language]?.[field]?.[value] ?? value
}

const getLocalizedEvent = (eventItem, language) => ({
  ...eventItem,
  title: translateEventValue(language, 'titles', eventItem.title),
  city: translateEventValue(language, 'cities', eventItem.city),
  location: translateEventValue(language, 'locations', eventItem.location),
  category: translateEventValue(language, 'categories', eventItem.category),
  description: translateEventValue(language, 'descriptions', eventItem.description),
  price_text: translateEventValue(language, 'prices', eventItem.price_text),
})

function Field({ label, error, className = '', children }) {
  return (
    <div className={`field ${className}`.trim()}>
      <label>{label}</label>
      {children}
      {error ? <span className="fieldError">{error}</span> : null}
    </div>
  )
}

function AdminEvents() {
  const { language, dir } = useLanguage()
  const text = copy[language] ?? copy.ar
  const locale = language === 'en' ? 'en-US' : 'ar-SA'
  const dateInputLanguage = language === 'en' ? 'en-GB' : 'ar-SA'
  const statusOptions = [
    { value: 'active', label: text.statusOptions.active },
    { value: 'inactive', label: text.statusOptions.inactive },
  ]

  const [searchInput, setSearchInput] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [summary, setSummary] = useState({
    totalEvents: 0,
    activeEvents: 0,
    categoriesCount: 0,
    citiesCount: 0,
    resultsCount: 0,
  })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({ ...emptyForm })
  const [formErrors, setFormErrors] = useState({})
  const [editingId, setEditingId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleteEvent, setDeleteEvent] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const formatDateTime = useCallback(
    (value) => {
      if (!value) return text.misc.dash
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return text.misc.dash
      return date.toLocaleString(locale)
    },
    [locale, text.misc.dash],
  )

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_LIMIT),
        includeInactive: 'true',
      })
      if (query) params.set('q', query)
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const payload = await apiRequest(`/admin/events?${params.toString()}`)
      setSummary(payload?.summary ?? {})
      setItems(Array.isArray(payload?.items) ? payload.items : [])
    } catch (err) {
      setError(err?.message || text.form.errors.loadFailed)
      setSummary({
        totalEvents: 0,
        activeEvents: 0,
        categoriesCount: 0,
        citiesCount: 0,
        resultsCount: 0,
      })
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [page, query, statusFilter, text.form.errors.loadFailed])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const summaryCards = useMemo(
    () => [
      { label: text.summary.totalEvents, value: summary.totalEvents ?? 0 },
      { label: text.summary.activeEvents, value: summary.activeEvents ?? 0 },
      { label: text.summary.categoriesCount, value: summary.categoriesCount ?? 0 },
      { label: text.summary.citiesCount, value: summary.citiesCount ?? 0 },
      { label: text.summary.resultsCount, value: summary.resultsCount ?? 0 },
    ],
    [summary, text.summary],
  )

  const totalPages = Math.max(1, Math.ceil((summary.resultsCount || 0) / PAGE_LIMIT))
  const isEditing = Boolean(editingId)
  const localizedDeleteEvent = deleteEvent ? getLocalizedEvent(deleteEvent, language) : null

  const resetForm = () => {
    setEditingId('')
    setFormData({ ...emptyForm })
    setFormErrors({})
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = text.form.errors.title
    if (!formData.city.trim()) errors.city = text.form.errors.city
    if (!formData.location.trim()) errors.location = text.form.errors.location
    if (!formData.category.trim()) errors.category = text.form.errors.category
    if (!formData.startDatetime) errors.startDatetime = text.form.errors.startDatetime
    if (formData.endDatetime && formData.endDatetime < formData.startDatetime) {
      errors.endDatetime = text.form.errors.endDatetime
    }
    if (formData.imageUrl.trim() && !isHttpUrl(formData.imageUrl.trim())) {
      errors.imageUrl = text.form.errors.imageUrl
    }
    if (formData.officialBookingUrl.trim() && !isHttpUrl(formData.officialBookingUrl.trim())) {
      errors.officialBookingUrl = text.form.errors.officialBookingUrl
    }
    return errors
  }

  const buildPayload = () => {
    const payload = {
      title: formData.title.trim(),
      city: formData.city.trim(),
      location: formData.location.trim(),
      category: formData.category.trim(),
      start_datetime: new Date(formData.startDatetime).toISOString(),
      status: formData.status,
    }

    if (formData.description.trim()) payload.description = formData.description.trim()
    if (formData.imageUrl.trim()) payload.image_url = formData.imageUrl.trim()
    if (formData.priceText.trim()) payload.price_text = formData.priceText.trim()
    if (formData.endDatetime) payload.end_datetime = new Date(formData.endDatetime).toISOString()
    if (formData.officialBookingUrl.trim()) {
      payload.official_booking_url = formData.officialBookingUrl.trim()
    }

    return payload
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateForm()
    setFormErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    try {
      setSubmitting(true)
      const payload = buildPayload()
      if (isEditing) {
        await apiRequest(`/admin/events/${editingId}`, {
          method: 'PATCH',
          body: payload,
        })
      } else {
        await apiRequest('/admin/events', {
          method: 'POST',
          body: payload,
        })
      }
      setPage(1)
      await fetchEvents()
      resetForm()
    } catch (err) {
      setFormErrors((prev) => ({
        ...prev,
        submit: err?.message || text.form.errors.submitFailed,
      }))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (eventItem) => {
    setEditingId(eventItem.id)
    setFormData({
      title: eventItem.title ?? '',
      city: eventItem.city ?? '',
      location: eventItem.location ?? '',
      category: eventItem.category ?? '',
      description: eventItem.description ?? '',
      imageUrl: eventItem.image_url ?? '',
      priceText: eventItem.price_text ?? '',
      startDatetime: toInputDateTime(eventItem.start_datetime),
      endDatetime: toInputDateTime(eventItem.end_datetime),
      officialBookingUrl: eventItem.official_booking_url ?? '',
      status: eventItem.status ?? 'active',
    })
    setFormErrors({})
  }

  const handleDeactivate = async () => {
    if (!deleteEvent) return
    try {
      setDeleteLoading(true)
      await apiRequest(`/admin/events/${deleteEvent.id}`, { method: 'DELETE' })
      setDeleteEvent(null)
      await fetchEvents()
    } catch (err) {
      setFormErrors((prev) => ({
        ...prev,
        submit: err?.message || text.form.errors.deactivateFailed,
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
            <p className="adminEyebrow">{text.hero.eyebrow}</p>
            <h1>{text.hero.title}</h1>
            <p className="adminSubtitle">{text.hero.subtitle}</p>
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
              <form
                className="adminFilters adminEventsFilters"
                onSubmit={(event) => {
                  event.preventDefault()
                  setPage(1)
                  setQuery(searchInput.trim())
                }}
              >
                <div className="field">
                  <label htmlFor="admin-event-search">{text.filters.searchLabel}</label>
                  <input
                    id="admin-event-search"
                    className="input"
                    type="search"
                    placeholder={text.filters.searchPlaceholder}
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="admin-event-status">{text.filters.statusLabel}</label>
                  <select
                    id="admin-event-status"
                    className="select"
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value)
                      setPage(1)
                    }}
                  >
                    <option value="all">{text.filters.all}</option>
                    {statusOptions.map((option) => (
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
            </section>

            <section className="adminTableCard">
              <div className="adminTableHeader">
                <h2>{text.table.title}</h2>
                <button className="primaryBtn" type="button" onClick={resetForm}>
                  {text.table.add}
                </button>
              </div>

              {loading ? <p className="adminToolbarHint">{text.table.loading}</p> : null}
              {error ? <p className="fieldError">{error}</p> : null}

              <div className="adminTableWrap">
                <table className="adminTable">
                  <thead>
                    <tr>
                      <th>{text.table.columns.event}</th>
                      <th>{text.table.columns.city}</th>
                      <th>{text.table.columns.category}</th>
                      <th>{text.table.columns.date}</th>
                      <th>{text.table.columns.status}</th>
                      <th>{text.table.columns.booking}</th>
                      <th>{text.table.columns.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && !items.length ? (
                      <tr>
                        <td colSpan="7">{text.table.empty}</td>
                      </tr>
                    ) : null}

                    {items.map((eventItem) => {
                      const localizedEvent = getLocalizedEvent(eventItem, language)

                      return (
                        <tr key={eventItem.id}>
                          <td>
                            <div className="adminEventCell">
                              <img
                                src={eventItem.display_image_url || eventItem.image_url || fallbackImage}
                                alt={localizedEvent.title}
                              />
                              <div>
                                <strong>{localizedEvent.title}</strong>
                                <p>{localizedEvent.location}</p>
                              </div>
                            </div>
                          </td>
                          <td>{localizedEvent.city}</td>
                          <td>{localizedEvent.category}</td>
                          <td>{formatDateTime(eventItem.start_datetime)}</td>
                          <td>
                            {eventItem.status === 'active'
                              ? text.statusOptions.active
                              : text.statusOptions.inactive}
                          </td>
                          <td>
                            {eventItem.official_booking_url ? (
                              <a href={eventItem.official_booking_url} target="_blank" rel="noreferrer">
                                {text.table.bookingAvailable}
                              </a>
                            ) : (
                              text.table.bookingUnavailable
                            )}
                          </td>
                          <td>
                            <div className="adminTableActions">
                              <button className="secondaryBtn" type="button" onClick={() => handleEdit(eventItem)}>
                                {text.table.edit}
                              </button>
                              <button
                                className="secondaryBtn dangerText"
                                type="button"
                                onClick={() => setDeleteEvent(eventItem)}
                              >
                                {text.table.deactivate}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="adminPagination">
              <div className="adminPaginationActions">
                <button
                  className="secondaryBtn"
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  {text.pagination.previous}
                </button>
                <span className="adminToolbarHint">
                  {text.pagination.summary.replace('{{page}}', page).replace('{{total}}', totalPages)}
                </span>
                <button
                  className="secondaryBtn"
                  type="button"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page >= totalPages}
                >
                  {text.pagination.next}
                </button>
              </div>
            </section>
          </div>

          <aside className="adminFormCard">
            <div className="adminFormHeader">
              <div>
                <p className="adminEyebrow">{text.form.eyebrow}</p>
                <h2>{isEditing ? text.form.editTitle : text.form.createTitle}</h2>
              </div>
              {isEditing ? (
                <button className="secondaryBtn" type="button" onClick={resetForm}>
                  {text.form.cancelEdit}
                </button>
              ) : null}
            </div>

            <form className="adminForm" onSubmit={handleSubmit}>
              <div className="adminFormGrid adminEventsFormGrid">
                <Field label={text.form.fields.title} error={formErrors.title}>
                  <input
                    className="input"
                    value={formData.title}
                    onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                  />
                </Field>
                <Field label={text.form.fields.city} error={formErrors.city}>
                  <input
                    className="input"
                    value={formData.city}
                    onChange={(event) => setFormData((prev) => ({ ...prev, city: event.target.value }))}
                  />
                </Field>
                <Field label={text.form.fields.location} error={formErrors.location}>
                  <input
                    className="input"
                    value={formData.location}
                    onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
                  />
                </Field>
                <Field label={text.form.fields.category} error={formErrors.category}>
                  <input
                    className="input"
                    value={formData.category}
                    onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                  />
                </Field>
                <Field label={text.form.fields.priceText}>
                  <input
                    className="input"
                    value={formData.priceText}
                    onChange={(event) => setFormData((prev) => ({ ...prev, priceText: event.target.value }))}
                  />
                </Field>
                <Field label={text.form.fields.status}>
                  <select
                    className="select"
                    value={formData.status}
                    onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field className="full" label={text.form.fields.startDatetime} error={formErrors.startDatetime}>
                  <input
                    className="input adminDateTimeInput"
                    type="datetime-local"
                    lang={dateInputLanguage}
                    dir="ltr"
                    value={formData.startDatetime}
                    onChange={(event) => setFormData((prev) => ({ ...prev, startDatetime: event.target.value }))}
                  />
                </Field>
                <Field className="full" label={text.form.fields.endDatetime} error={formErrors.endDatetime}>
                  <input
                    className="input adminDateTimeInput"
                    type="datetime-local"
                    lang={dateInputLanguage}
                    dir="ltr"
                    value={formData.endDatetime}
                    onChange={(event) => setFormData((prev) => ({ ...prev, endDatetime: event.target.value }))}
                  />
                </Field>
                <Field className="full" label={text.form.fields.description}>
                  <textarea
                    className="input"
                    rows={4}
                    value={formData.description}
                    onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                  />
                </Field>
                <Field className="full" label={text.form.fields.imageUrl} error={formErrors.imageUrl}>
                  <input
                    className="input"
                    dir="ltr"
                    value={formData.imageUrl}
                    onChange={(event) => setFormData((prev) => ({ ...prev, imageUrl: event.target.value }))}
                  />
                </Field>
                <Field
                  className="full"
                  label={text.form.fields.officialBookingUrl}
                  error={formErrors.officialBookingUrl}
                >
                  <input
                    className="input"
                    dir="ltr"
                    value={formData.officialBookingUrl}
                    onChange={(event) => setFormData((prev) => ({ ...prev, officialBookingUrl: event.target.value }))}
                  />
                </Field>
              </div>

              {formErrors.submit ? <p className="fieldError">{formErrors.submit}</p> : null}

              <div className="adminFormActions">
                <button className="primaryBtn" type="submit" disabled={submitting}>
                  {submitting
                    ? text.form.actions.submitting
                    : isEditing
                      ? text.form.actions.save
                      : text.form.actions.create}
                </button>
                <button className="secondaryBtn" type="button" onClick={resetForm}>
                  {text.form.actions.reset}
                </button>
              </div>
            </form>
          </aside>
        </section>
      </main>

      {deleteEvent ? (
        <div className="adminModal" role="dialog" aria-modal="true">
          <div className="adminModalCard confirmCard">
            <h3>{text.modal.title}</h3>
            <p className="modalDescription">{text.modal.description}</p>
            {localizedDeleteEvent?.title ? (
              <p className="modalDescription">
                <strong>{localizedDeleteEvent.title}</strong>
              </p>
            ) : null}
            <div className="adminModalActions">
              <button
                className="secondaryBtn"
                type="button"
                onClick={() => setDeleteEvent(null)}
                disabled={deleteLoading}
              >
                {text.modal.cancel}
              </button>
              <button
                className="primaryBtn danger"
                type="button"
                onClick={handleDeactivate}
                disabled={deleteLoading}
              >
                {deleteLoading ? text.modal.loading : text.modal.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AdminEvents
