import { useMemo, useState } from 'react'
import '../Home/Home.css'
import './TripsAvailable.css'
import Header from '../Home/components/Header'
import Footer from '../Home/components/Footer'
import TripsHero from '../../components/trips/TripsHero'
import TripsFilters from '../../components/trips/TripsFilters'
import TripsGrid from '../../components/trips/TripsGrid'
import TripsPagination from '../../components/trips/TripsPagination'
import { loadTrips } from '../../data/trips.store'
import { useLanguage } from '../../i18n/LanguageContext'
import {
  TRIP_TAG_KEYS,
  TRIP_SORT_KEYS,
  getTripTagValue,
  getTripCityKey,
  getTripCityValue,
  getTripDurationKey,
  getTripDurationValue,
} from '../../i18n/tripsMappings'

const chips = TRIP_TAG_KEYS
const sorts = TRIP_SORT_KEYS

function TripsAvailable() {
  const { t, dir } = useLanguage()
  const [trips] = useState(() => loadTrips())
  const [query, setQuery] = useState('')
  const [activeChip, setActiveChip] = useState('all')
  const [filters, setFilters] = useState({
    city: 'all',
    duration: 'all',
    sort: 'highestRated',
    minPrice: '',
    maxPrice: '',
  })

  const cities = useMemo(() => {
    const list = Array.from(new Set(trips.map((t) => getTripCityKey(t.city))))
    return ['all', ...list]
  }, [trips])

  const durations = useMemo(() => {
    const list = Array.from(new Set(trips.map((t) => getTripDurationKey(t.durationLabel))))
    return ['all', ...list]
  }, [trips])

  const filtered = useMemo(() => {
    let list = [...trips]
    const q = query.trim()

    if (q) {
      const normalized = q.toLowerCase()
      list = list.filter((trip) => {
        const cityKey = getTripCityKey(trip.city)
        const titleTranslated = t(`trips.data.${trip.id}.title`, { fallback: trip.title })
        const cityTranslated = t(`trips.cities.${cityKey}`, { fallback: trip.city })
        const haystack = `${trip.title} ${trip.city} ${titleTranslated} ${cityTranslated}`
        return haystack.toLowerCase().includes(normalized)
      })
    }

    if (activeChip !== 'all') {
      const tagValue = getTripTagValue(activeChip)
      list = list.filter((trip) => trip.tags?.includes(tagValue))
    }

    if (filters.city !== 'all') {
      const cityValue = getTripCityValue(filters.city)
      list = list.filter((trip) => trip.city === cityValue)
    }

    if (filters.duration !== 'all') {
      const durationValue = getTripDurationValue(filters.duration)
      list = list.filter((trip) => trip.durationLabel === durationValue)
    }

    const min = filters.minPrice ? Number(filters.minPrice) : null
    const max = filters.maxPrice ? Number(filters.maxPrice) : null

    if (min !== null && !Number.isNaN(min)) {
      list = list.filter((trip) => trip.price >= min)
    }

    if (max !== null && !Number.isNaN(max)) {
      list = list.filter((trip) => trip.price <= max)
    }

    if (filters.sort === 'lowestPrice') {
      list.sort((a, b) => a.price - b.price)
    }

    if (filters.sort === 'highestRated') {
      list.sort((a, b) => b.rating - a.rating)
    }

    return list
  }, [trips, query, activeChip, filters, t])

  const chipOptions = chips.map((key) => ({
    key,
    label: t(`trips.tags.${key}`),
  }))
  const sortOptions = sorts.map((key) => ({
    key,
    label: t(`trips.sorts.${key}`),
  }))
  const cityOptions = cities.map((key) => ({
    key,
    label: key === 'all' ? t('trips.filters.all') : t(`trips.cities.${key}`, { fallback: key }),
  }))
  const durationOptions = durations.map((key) => ({
    key,
    label:
      key === 'all' ? t('trips.filters.all') : t(`trips.durations.${key}`, { fallback: key }),
  }))

  return (
    <div className="home tripsPage" dir={dir}>
      <Header />

      <main className="tripsMain">
        <TripsHero count={filtered.length} />

        <TripsFilters
          chips={chipOptions}
          sorts={sortOptions}
          cities={cityOptions}
          durations={durationOptions}
          query={query}
          setQuery={setQuery}
          activeChip={activeChip}
          setActiveChip={setActiveChip}
          filters={filters}
          setFilters={setFilters}
          title={t('trips.filters.title')}
          resetLabel={t('trips.filters.reset')}
          ariaLabel={t('trips.filters.ariaLabel')}
          searchLabel={t('trips.filters.searchLabel')}
          searchPlaceholder={t('trips.filters.searchPlaceholder')}
          cityLabel={t('trips.filters.cityLabel')}
          durationLabel={t('trips.filters.durationLabel')}
          budgetLabel={t('trips.filters.budgetLabel', { params: { currency: t('trips.currency') } })}
          minPlaceholder={t('trips.filters.minPlaceholder')}
          maxPlaceholder={t('trips.filters.maxPlaceholder')}
          sortLabel={t('trips.filters.sortLabel')}
        />

        <TripsGrid trips={filtered} />

        <TripsPagination />
      </main>

      <Footer />
    </div>
  )
}

export default TripsAvailable
