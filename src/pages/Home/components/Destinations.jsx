import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import destinationsFallback from '../../../data/destinations'
import { useLanguage } from '../../../i18n/LanguageContext'
import { apiRequest } from '../../../api/client'

const REGION_KEY_BY_ARABIC = {
  الوسطى: 'central',
  الغربية: 'west',
  الشمالية: 'north',
  الجنوبية: 'south',
  الشرقية: 'east',
}

const getRegionKey = (region) => REGION_KEY_BY_ARABIC[region] || region

function Destinations() {
  const { t, dir } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('all')
  const [destinations, setDestinations] = useState([])
  const [events, setEvents] = useState([])
  const [loadError, setLoadError] = useState('')
  const scrollRef = useRef(null)

  const handleScrollNext = () => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'rtl' ? -320 : 320, behavior: 'smooth' })
  }

  const fallbackByName = useMemo(
    () => new Map(destinationsFallback.map((destination) => [destination.name, destination.coverImage])),
    [],
  )
  const fallbackIdByName = useMemo(
    () => new Map(destinationsFallback.map((destination) => [destination.name, destination.id])),
    [],
  )

  useEffect(() => {
    let isMounted = true

    const loadDestinations = async () => {
      setLoadError('')
      try {
        const data = await apiRequest(`/destinations?region=${activeFilter}`)
        if (!isMounted) return
        const mapped = (Array.isArray(data) ? data : []).map((destination) => ({
          id: fallbackIdByName.get(destination.name) || destination.id,
          name: destination.name,
          region: destination.region,
          description: destination.description ?? '',
          coverImage:
            fallbackByName.get(destination.name) || destinationsFallback[0]?.coverImage,
        }))
        setDestinations(mapped)
      } catch (error) {
        if (!isMounted) return
        setLoadError(error?.message || 'Failed to load destinations')
        setDestinations([])
      }
    }

    loadDestinations()
    return () => {
      isMounted = false
    }
  }, [activeFilter, fallbackByName, fallbackIdByName])

  useEffect(() => {
    let isMounted = true

    const loadEvents = async () => {
      try {
        const data = await apiRequest('/events')
        if (!isMounted) return
        setEvents(Array.isArray(data?.events) ? data.events : [])
      } catch {
        if (!isMounted) return
        setEvents([])
      }
    }

    loadEvents()
    return () => {
      isMounted = false
    }
  }, [])

  const eventCountByCity = useMemo(() => {
    const map = new Map()
    events.forEach((event) => {
      const city = event.city?.trim()
      if (!city) return
      map.set(city, (map.get(city) || 0) + 1)
    })
    return map
  }, [events])

  const filters = ['all', 'central', 'west', 'east', 'north', 'south']
  const baseDestinations = destinations.length ? destinations : destinationsFallback
  const visibleDestinations =
    destinations.length || activeFilter === 'all'
      ? baseDestinations
      : baseDestinations.filter((destination) => getRegionKey(destination.region) === activeFilter)

  return (
    <section className="section" id="destinations">
      <div className="container">
        <div className="sectionHead">
          <h2 className="sectionTitle">{t('home.destinations.title')}</h2>

          <div className="chips">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`chip ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'all'
                  ? t('regions.all')
                  : t(`regions.${filter}`, { fallback: filter })}
              </button>
            ))}
          </div>
        </div>

        <div className="destScrollWrap">
          <button
            className="scrollBtn"
            type="button"
            onClick={handleScrollNext}
            aria-label={t('home.destinations.scrollAria')}
          >
            {dir === 'rtl' ? '<' : '>'}
          </button>
          <div className="destScroll" ref={scrollRef} style={{ direction: dir }}>
            {visibleDestinations.map((destination) => (
              <article className="destCard" key={destination.id} style={{ direction: dir }}>
                <div className="destImg">
                  <img
                    src={destination.coverImage}
                    alt={t(`destinationNames.${destination.id}`, {
                      fallback: destination.name,
                    })}
                    loading="lazy"
                  />
                </div>
                <div className="destBody">
                  <div className="destInfo">
                    <h3 className="destName">
                      {t(`destinationNames.${destination.id}`, {
                        fallback: destination.name,
                      })}
                    </h3>
                    <p className="destMeta">
                      {t(`regions.${getRegionKey(destination.region)}`, {
                        fallback: destination.region,
                      })}
                    </p>
                    <p className="destEventsMeta">
                      {(eventCountByCity.get(destination.name) || 0) > 0
                        ? t('home.destinations.eventsAvailable')
                        : t('home.destinations.eventsUnavailable')}
                    </p>
                  </div>
                  <div className="destActions">
                    <Link className="miniBtn" to={`/destinations/${destination.id}`}>
                      {t('home.destinations.cardCta')}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        {loadError ? <p className="sectionText">{loadError}</p> : null}
      </div>
    </section>
  )
}

export default Destinations
