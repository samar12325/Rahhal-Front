import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import destinationsFallback from '../../data/destinations'
import InfoCards from '../../components/Destination/InfoCards'
import MapEmbed from '../../components/Destination/MapEmbed'
import Gallery from '../../components/Destination/Gallery'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'
import './DestinationDetails.css'

const DESTINATION_REGION_KEYS = {
  riyadh: 'central',
  jeddah: 'west',
  alula: 'north',
  abha: 'south',
  khobar: 'east',
  taif: 'west',
  'red-sea': 'west',
}

const DESTINATION_COPY = {
  ar: {
    infoCards: [
      { label: 'أفضل وقت للزيارة', value: 'أكتوبر - مارس' },
      { label: 'نوع الرحلة', value: 'ثقافية وترفيهية' },
      { label: 'مدة مقترحة', value: '3 - 5 أيام' },
      { label: 'مستوى الميزانية', value: 'متوسطة' },
    ],
  },
  en: {
    infoCards: [
      { label: 'Best time to visit', value: 'October - March' },
      { label: 'Trip style', value: 'Culture and entertainment' },
      { label: 'Suggested duration', value: '3 - 5 days' },
      { label: 'Budget level', value: 'Moderate' },
    ],
  },
}

const DESTINATION_CONTENT_EN = {
  riyadh: {
    description:
      'The capital of Saudi Arabia blends a modern city rhythm with Najdi heritage, from cultural districts and refined dining to open parks and lively urban landmarks.',
    highlights: ['Historic Diriyah', 'Boulevard Riyadh City', 'JAX District', 'Wadi Hanifah'],
  },
  jeddah: {
    description:
      'A Red Sea destination that brings together the spirit of old Jeddah, coastal views, and modern experiences along the waterfront.',
    highlights: ['Historic Al Balad', 'Jeddah Corniche', 'King Fahd Fountain', 'Fish Market'],
  },
  alula: {
    description:
      'A landscape of sandstone wonders and ancient monuments, where old civilizations meet dramatic desert scenery and star-filled nights.',
    highlights: ['Elephant Rock', 'Hegra', 'Maraya', 'Old Town'],
  },
  abha: {
    description:
      'A mountain city of clouds and greenery, known for its mild weather, scenic heights, and nature-filled atmosphere.',
    highlights: ['Al Soudah', 'Rijal Almaa', 'Fog Walk', 'Aseer National Park'],
  },
  khobar: {
    description:
      'A modern seaside city on the Gulf, known for its pleasant corniche, calm cafes, and vibrant shopping spots.',
    highlights: ['Khobar Corniche', 'Ajdan Walk', 'Al Rashid Mall', 'Half Moon Beach'],
  },
  taif: {
    description:
      'A highland city of roses and cool weather, famous for its traditional markets, flower farms, and refreshing mountain air.',
    highlights: ['Al Hada', 'Al Shafa', 'Rose Farm', 'Souq Okaz'],
  },
  'red-sea': {
    description:
      'A stunning coastal escape with pristine beaches, coral islands, and high-end leisure experiences along the shore.',
    highlights: ['Pristine beaches', 'Coral reefs', 'Luxury resorts', 'Private islands'],
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
      'العلا': 'AlUla',
      'أبها': 'Abha',
      'الدمام': 'Dammam',
      'تبوك': 'Tabuk',
      'الرياض': 'Riyadh',
      'جدة': 'Jeddah',
    },
    locations: {
      'البلدة القديمة': 'Old Town',
      'رجال ألمع': 'Rijal Almaa',
      'سوق القيصرية - الأحساء': 'Qaisariyah Souq - Al Ahsa',
      'تبوك': 'Tabuk',
      'قلعة تبوك': 'Tabuk Castle',
      'بوليفارد رياض سيتي': 'Boulevard Riyadh City',
      'جبل الفيل': 'Elephant Rock',
      'كورنيش الدمام': 'Dammam Corniche',
      'الدرعية': 'Diriyah',
      'جدة التاريخية - البلد': 'Historic Jeddah - Al Balad',
      'السودة': 'Al Soudah',
      'واجهة جدة البحرية': 'Jeddah Waterfront',
    },
    categories: {
      'ثقافة وتراث': 'Culture and heritage',
      'ثقافة وتسوق': 'Culture and shopping',
      'طبيعة': 'Nature',
      'ترفيه': 'Entertainment',
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
      'مجاني': 'Free',
      'حسب الجولة': 'Depends on the tour',
      'حسب الفعالية': 'Depends on the event',
      'يبدأ من 50 ريال': 'Starts from 50 SAR',
      'مجاني / حسب الجولة': 'Free / depends on the tour',
      'حسب النشاط': 'Depends on the activity',
    },
  },
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

const getRegionKey = (destination) => {
  if (!destination) return ''
  if (DESTINATION_REGION_KEYS[destination.id]) return DESTINATION_REGION_KEYS[destination.id]

  const region = String(destination.region || '').trim().toLowerCase()
  if (['central', 'west', 'east', 'north', 'south'].includes(region)) return region
  if (region === 'الوسطى') return 'central'
  if (region === 'الغربية') return 'west'
  if (region === 'الشرقية') return 'east'
  if (region === 'الشمالية') return 'north'
  if (region === 'الجنوبية') return 'south'
  return ''
}

const getLocalizedDestinationName = (destination, t) => {
  if (!destination) return ''
  return t(`destinationNames.${destination.id}`, {
    fallback: destination.name,
  })
}

const getLocalizedDestinationDescription = (destination, language) => {
  if (!destination) return ''
  if (language === 'en') {
    return DESTINATION_CONTENT_EN[destination.id]?.description || destination.description
  }
  return destination.description
}

const getLocalizedDestinationHighlights = (destination, language) => {
  if (!Array.isArray(destination?.highlights)) return []
  if (language === 'en') {
    return DESTINATION_CONTENT_EN[destination.id]?.highlights || destination.highlights
  }
  return destination.highlights
}

function DestinationDetails() {
  const { id } = useParams()
  const { t, language, dir } = useLanguage()
  const [remoteDestination, setRemoteDestination] = useState(null)
  const [events, setEvents] = useState([])
  const [eventsError, setEventsError] = useState('')
  const [loadError, setLoadError] = useState('')

  const localDestination = useMemo(
    () => destinationsFallback.find((item) => item.id === id),
    [id],
  )
  const isNumericId = /^\d+$/.test(id ?? '')

  useEffect(() => {
    let isMounted = true

    const loadDestination = async () => {
      if (localDestination || !isNumericId) {
        setRemoteDestination(null)
        return
      }

      setLoadError('')
      try {
        const data = await apiRequest(`/destinations/${id}`)
        if (!isMounted) return
        const fallback = destinationsFallback.find((item) => item.name === data.name)
        setRemoteDestination({
          id: fallback?.id || data.id,
          name: data.name,
          region: data.region,
          description: data.description ?? '',
          coverImage: fallback?.coverImage || destinationsFallback[0]?.coverImage,
          highlights: fallback?.highlights ?? [],
          gallery: fallback?.gallery ?? [],
          googleMapUrl: fallback?.googleMapUrl ?? '',
        })
      } catch (error) {
        if (!isMounted) return
        setLoadError(error?.message || 'Failed to load destination')
        setRemoteDestination(null)
      }
    }

    loadDestination()
    return () => {
      isMounted = false
    }
  }, [id, isNumericId, localDestination])

  const destination = localDestination || remoteDestination

  useEffect(() => {
    let isMounted = true

    const loadEvents = async () => {
      if (!destination?.name) {
        setEvents([])
        return
      }

      try {
        setEventsError('')
        const data = await apiRequest('/events')
        if (!isMounted) return
        setEvents(Array.isArray(data?.events) ? data.events : [])
      } catch (error) {
        if (!isMounted) return
        setEventsError(error?.message || 'Failed to load events')
        setEvents([])
      }
    }

    loadEvents()
    return () => {
      isMounted = false
    }
  }, [destination?.name])

  if (!destination) {
    return (
      <div className="destinationDetails" dir={dir}>
        <div className="container destinationEmpty">
          <h1 className="destinationEmptyTitle">{t('destinationDetails.events.notFoundTitle')}</h1>
          <p className="destinationEmptyText">
            {loadError || t('destinationDetails.events.notFoundFallback')}
          </p>
          <Link className="destinationBackBtn" to="/home">
            {t('destinationDetails.events.backHome')}
          </Link>
        </div>
      </div>
    )
  }

  const displayName = getLocalizedDestinationName(destination, t)
  const regionKey = getRegionKey(destination)
  const regionLabel =
    t(`regions.${regionKey}`, {
      fallback: destination.region,
    }) || destination.region
  const overviewText =
    getLocalizedDestinationDescription(destination, language) ||
    t('destinationDetails.events.overviewFallback')
  const highlights = getLocalizedDestinationHighlights(destination, language)
  const infoCards = localDestination ? DESTINATION_COPY[language]?.infoCards || DESTINATION_COPY.ar.infoCards : []
  const hasHighlights = highlights.length > 0
  const hasGallery = Array.isArray(destination.gallery) && destination.gallery.length
  const hasMap = Boolean(destination.googleMapUrl)
  const activeEvents = events.filter(
    (eventItem) => eventItem.city === destination.name && eventItem.status === 'active',
  )
  const dateLocale = language === 'en' ? 'en-US' : 'ar-SA'

  return (
    <div className="destinationDetails" dir={dir}>
      <section className="destinationHero">
        <div className="destinationHeroMedia">
          <img src={destination.coverImage} alt={displayName} loading="lazy" />
          <div className="destinationHeroOverlay" />
        </div>
        <div className="container destinationHeroContent">
          <span className="destinationRegion">{regionLabel}</span>
          <h1 className="destinationName">{displayName}</h1>
          <p className="destinationIntro">
            {t('destinationDetails.events.heroIntro', { params: { name: displayName } })}
          </p>
          <a className="destinationCta" href="#activities">
            {t('destinationDetails.events.heroCta')}
          </a>
        </div>
      </section>

      <section className="destinationSection">
        <div className="container">
          <div className="sectionHeading">
            <h2>{t('destinationDetails.events.overviewTitle')}</h2>
            <p className="sectionText">{overviewText}</p>
          </div>
          {localDestination ? <InfoCards items={infoCards} /> : null}
        </div>
      </section>

      {hasHighlights ? (
        <section className="destinationSection">
          <div className="container">
            <div className="sectionHeading">
              <h2>{t('destinationDetails.events.highlightsTitle')}</h2>
              <p className="sectionText">{t('destinationDetails.events.highlightsSubtitle')}</p>
            </div>
            <div className="highlightChips">
              {highlights.map((item) => (
                <span className="highlightChip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="destinationSection" id="activities">
        <div className="container">
          <div className="sectionHeading">
            <h2>{t('destinationDetails.events.title')}</h2>
            <p className="sectionText">{t('destinationDetails.events.subtitle')}</p>
          </div>

          {eventsError ? <p className="activitiesEmpty">{eventsError}</p> : null}

          {activeEvents.length ? (
            <div className="destinationEventsGrid">
              {activeEvents.map((eventItem) => {
                const localizedEvent = getLocalizedEvent(eventItem, language)

                return (
                  <article className="destinationEventCard" key={eventItem.id}>
                    <div className="destinationEventImage">
                      <img
                        src={eventItem.display_image_url || eventItem.image_url || destination.coverImage}
                        alt={localizedEvent.title}
                        loading="lazy"
                      />
                    </div>
                    <div className="destinationEventBody">
                      <div className="destinationEventHead">
                        <h3>{localizedEvent.title}</h3>
                        <span className="activityType">{localizedEvent.category}</span>
                      </div>
                      <p className="destinationEventMeta">{localizedEvent.location}</p>
                      <p className="destinationEventPrice">
                        {localizedEvent.price_text || t('destinationDetails.events.priceFallback')}
                      </p>
                      <p className="destinationEventMeta">
                        {new Date(eventItem.start_datetime).toLocaleString(dateLocale)}
                      </p>
                      {eventItem.official_booking_url ? (
                        <div className="destinationEventActions">
                          <a
                            className="activityBtn"
                            href={eventItem.official_booking_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {t('destinationDetails.events.book')}
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="destinationEventsEmpty">
              <p className="activitiesEmpty">{t('destinationDetails.events.empty')}</p>
            </div>
          )}
        </div>
      </section>

      {hasMap ? (
        <section className="destinationSection">
          <div className="container">
            <div className="sectionHeading">
              <h2>{t('destinationDetails.events.mapTitle')}</h2>
              <p className="sectionText">{t('destinationDetails.events.mapSubtitle')}</p>
            </div>
            <MapEmbed googleMapUrl={destination.googleMapUrl} name={displayName} />
          </div>
        </section>
      ) : null}

      {hasGallery ? (
        <section className="destinationSection">
          <div className="container">
            <div className="sectionHeading">
              <h2>{t('destinationDetails.events.galleryTitle')}</h2>
              <p className="sectionText">{t('destinationDetails.events.gallerySubtitle')}</p>
            </div>
            <Gallery images={destination.gallery} name={displayName} />
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default DestinationDetails
