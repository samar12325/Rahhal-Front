import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import '../Home/Home.css'
import './EventsPage.css'
import Header from '../Home/components/Header'
import Footer from '../Home/components/Footer'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'

const fallbackImage = '/src/assets/images/saudi-map1.png'

const copy = {
  ar: {
    title: 'الفعاليات',
    subtitle: 'استعرض الفعاليات المتاحة واحجز مباشرة من الموقع الرسمي للجهة المنظمة.',
    count: (count) => `${count} فعالية متاحة`,
    searchLabel: 'بحث',
    searchPlaceholder: 'ابحث باسم الفعالية أو المدينة أو التصنيف',
    cityLabel: 'المدينة',
    categoryLabel: 'التصنيف',
    all: 'الكل',
    loading: 'جاري تحميل الفعاليات...',
    empty: 'لا توجد فعاليات مطابقة حاليًا.',
    unavailable: 'رابط الحجز غير متوفر حاليًا',
    book: 'احجز من الموقع الرسمي',
    date: 'التاريخ',
    location: 'الموقع',
    category: 'التصنيف',
    priceFallback: 'السعر يحدد من الجهة المنظمة',
    loadError: 'تعذر تحميل الفعاليات',
    dash: '-',
  },
  en: {
    title: 'Events',
    subtitle: 'Browse available events and book directly from the official organizer website.',
    count: (count) => `${count} events available`,
    searchLabel: 'Search',
    searchPlaceholder: 'Search by event name, city, or category',
    cityLabel: 'City',
    categoryLabel: 'Category',
    all: 'All',
    loading: 'Loading events...',
    empty: 'No matching events right now.',
    unavailable: 'Booking link is currently unavailable',
    book: 'Book on official website',
    date: 'Date',
    location: 'Location',
    category: 'Category',
    priceFallback: 'Price set by organizer',
    loadError: 'Failed to load events',
    dash: '-',
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

const formatDateRange = (language, startValue, endValue, dashLabel) => {
  const locale = language === 'ar' ? 'ar-SA' : 'en-US'
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  const start = startValue ? new Date(startValue) : null
  const end = endValue ? new Date(endValue) : null

  if (!start || Number.isNaN(start.getTime())) return dashLabel
  if (!end || Number.isNaN(end.getTime())) return formatter.format(start)
  return `${formatter.format(start)} - ${formatter.format(end)}`
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

function EventsPage() {
  const { language, dir } = useLanguage()
  const text = copy[language] ?? copy.ar
  const [searchParams, setSearchParams] = useSearchParams()
  const cityFromQuery = searchParams.get('city')?.trim() || ''
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [city, setCity] = useState(cityFromQuery || 'all')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    let mounted = true

    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        setLoadError('')
        const data = await apiRequest('/events')
        if (!mounted) return
        setEvents(Array.isArray(data?.events) ? data.events : [])
      } catch (error) {
        if (!mounted) return
        setLoadError(error?.message || text.loadError)
        setEvents([])
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchEvents()
    return () => {
      mounted = false
    }
  }, [text.loadError])

  useEffect(() => {
    setCity(cityFromQuery || 'all')
  }, [cityFromQuery])

  const cityOptions = useMemo(() => {
    return ['all', ...new Set(events.map((eventItem) => eventItem.city).filter(Boolean))]
  }, [events])

  const categoryOptions = useMemo(() => {
    return ['all', ...new Set(events.map((eventItem) => eventItem.category).filter(Boolean))]
  }, [events])

  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return events.filter((eventItem) => {
      if (city !== 'all' && eventItem.city !== city) return false
      if (category !== 'all' && eventItem.category !== category) return false
      if (!normalized) return true

      const localizedEvent = getLocalizedEvent(eventItem, language)
      const haystack = [
        eventItem.title,
        eventItem.city,
        eventItem.category,
        eventItem.location,
        eventItem.description,
        localizedEvent.title,
        localizedEvent.city,
        localizedEvent.category,
        localizedEvent.location,
        localizedEvent.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalized)
    })
  }, [category, city, events, language, query])

  const handleBook = (eventItem) => {
    if (eventItem.official_booking_url) {
      window.open(eventItem.official_booking_url, '_blank', 'noopener,noreferrer')
      return
    }

    window.alert(text.unavailable)
  }

  return (
    <div className="home eventsPage" dir={dir}>
      <Header />

      <main className="tripsMain">
        <section className="tripsHero">
          <div>
            <h1>{text.title}</h1>
            <p>{text.subtitle}</p>
          </div>
          <span className="countBadge">{text.count(filteredEvents.length)}</span>
        </section>

        <section className="filtersCard">
          <div className="filtersRow eventsFiltersRow">
            <div className="field">
              <label htmlFor="event-search">{text.searchLabel}</label>
              <input
                id="event-search"
                className="input"
                type="search"
                placeholder={text.searchPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="event-city">{text.cityLabel}</label>
              <select
                id="event-city"
                className="select"
                value={city}
                onChange={(event) => {
                  const nextCity = event.target.value
                  setCity(nextCity)
                  const nextParams = new URLSearchParams(searchParams)
                  if (nextCity === 'all') {
                    nextParams.delete('city')
                  } else {
                    nextParams.set('city', nextCity)
                  }
                  setSearchParams(nextParams, { replace: true })
                }}
              >
                {cityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'all' ? text.all : translateEventValue(language, 'cities', option)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="event-category">{text.categoryLabel}</label>
              <select
                id="event-category"
                className="select"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'all' ? text.all : translateEventValue(language, 'categories', option)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {loadError ? <p className="tripMeta">{loadError}</p> : null}
        {isLoading ? <p className="tripMeta">{text.loading}</p> : null}

        <section className="tripsGrid" aria-label={text.title}>
          {!isLoading && !filteredEvents.length ? (
            <div className="tripCard adminEmptyState">
              <div className="tripBody">
                <h3 className="tripTitle">{text.empty}</h3>
              </div>
            </div>
          ) : null}

          {filteredEvents.map((eventItem) => {
            const localizedEvent = getLocalizedEvent(eventItem, language)

            return (
              <article className="tripCard eventCard" key={eventItem.id}>
                <div className="tripImg">
                  <img
                    src={eventItem.display_image_url || eventItem.image_url || fallbackImage}
                    alt={localizedEvent.title}
                    loading="lazy"
                  />
                </div>
                <div className="tripBody">
                  <div className="tripHeader">
                    <h3 className="tripTitle">{localizedEvent.title}</h3>
                    <p className="tripLocation">{localizedEvent.city}</p>
                  </div>

                  <div className="tripMeta">
                    <span className="tripMetaItem">
                      {text.date}: {formatDateRange(language, eventItem.start_datetime, eventItem.end_datetime, text.dash)}
                    </span>
                    <span className="tripMetaItem">
                      {text.category}: {localizedEvent.category}
                    </span>
                    <span className="tripMetaItem">
                      {text.location}: {localizedEvent.location}
                    </span>
                  </div>

                  <p className="eventDescription">{localizedEvent.description || localizedEvent.location}</p>
                  <p className="eventPrice">{localizedEvent.price_text || text.priceFallback}</p>

                  <div className="tripActions">
                    <button className="primaryBtn" type="button" onClick={() => handleBook(eventItem)}>
                      {text.book}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default EventsPage
