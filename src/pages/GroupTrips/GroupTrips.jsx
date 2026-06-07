import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import '../Home/Home.css'
import './GroupTrips.css'
import Header from '../Home/components/Header'
import Footer from '../Home/components/Footer'
import GroupTripsHero from '../../components/groupTrips/GroupTripsHero'
import GroupTripsSearch from '../../components/groupTrips/GroupTripsSearch'
import GroupTripsTabs from '../../components/groupTrips/GroupTripsTabs'
import GroupTripsGrid from '../../components/groupTrips/GroupTripsGrid'
import CreateGroupTripForm from '../../components/groupTrips/CreateGroupTripForm'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'
import rahhalLogo from '../../assets/images/rahhal-logo.png'
import { localizeGroupTripValue } from '../../components/groupTrips/groupTripsLocale'

const fallbackImage = rahhalLogo
const DEFAULT_TAB = 'available'

const normalizeGroupTripsTab = (value) => {
  if (value === 'past' || value === 'create') return value
  return DEFAULT_TAB
}

const getTripStartValue = (trip) => trip.start_datetime || trip.start_date || trip.startDate || trip.date || ''

const getTripCapacity = (trip) =>
  Number(trip.capacity ?? trip.max_participants ?? trip.maxParticipants ?? trip.group_details?.required_participants ?? 0)

const getTripJoinedCount = (trip) =>
  Number(trip.current_participants ?? trip.currentParticipants ?? trip.joined_count ?? 0)

const getTripJoinableStatus = (trip) => {
  const rawStatus = String(trip.status || '').toLowerCase()
  return rawStatus === 'open' || rawStatus === 'available'
}

const getTripDateAtStartOfDay = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  date.setHours(0, 0, 0, 0)
  return date
}

const isPastTripFromValue = (value) => {
  const tripDate = getTripDateAtStartOfDay(value)
  if (!tripDate) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return tripDate < today
}

const mapApiGroupTripToUi = (trip) => {
  const destinationName = trip.destination?.name ?? ''
  const placeName = trip.group_details?.notes ?? ''
  const price =
    trip.price_per_person !== null && trip.price_per_person !== undefined
      ? Number(trip.price_per_person)
      : null
  const startDate = trip.start_datetime ?? trip.start_date ?? ''
  const endDate = trip.end_datetime ?? trip.end_date ?? startDate ?? ''
  const maxParticipants = getTripCapacity(trip)
  const currentParticipants = getTripJoinedCount(trip)
  const isPastTrip = Boolean(trip.is_past) || isPastTripFromValue(startDate)
  const canJoin =
    (typeof trip.can_join === 'boolean' ? trip.can_join : true) &&
    !isPastTrip &&
    getTripJoinableStatus(trip) &&
    (maxParticipants <= 0 || currentParticipants < maxParticipants)

  return {
    id: trip.id,
    destinationId: trip.destination_id,
    title: trip.title,
    city: destinationName,
    destination: placeName || destinationName,
    date: startDate,
    startDate,
    endDate,
    price,
    maxParticipants,
    capacity: maxParticipants,
    currentParticipants,
    joinedCount: currentParticipants,
    rawStatus: trip.status,
    status: canJoin ? 'available' : isPastTrip ? 'past' : 'upcoming',
    isPastTrip,
    canJoin,
    image: trip.image_url || trip.destination?.image_url || fallbackImage,
    description: trip.description || '',
  }
}

function GroupTrips() {
  const { t, dir, language } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTabState] = useState(() =>
    normalizeGroupTripsTab(searchParams.get('tab')),
  )
  const [availableTrips, setAvailableTrips] = useState([])
  const [pastTrips, setPastTrips] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [destinations, setDestinations] = useState([])
  const [destinationsLoading, setDestinationsLoading] = useState(false)

  const fetchTrips = useCallback(async () => {
    try {
      setIsLoading(true)
      setLoadError('')

      const [availableData, pastData] = await Promise.all([
        apiRequest('/api/group-trips/available'),
        apiRequest('/api/group-trips/past'),
      ])

      const availableItems = Array.isArray(availableData?.trips) ? availableData.trips : []
      const pastItems = Array.isArray(pastData?.trips) ? pastData.trips : []

      setAvailableTrips(availableItems.map(mapApiGroupTripToUi))
      setPastTrips(pastItems.map(mapApiGroupTripToUi))
    } catch (error) {
      setLoadError(error?.message || 'Failed to load group trips')
      setAvailableTrips([])
      setPastTrips([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  useEffect(() => {
    const nextTab = normalizeGroupTripsTab(searchParams.get('tab'))
    setActiveTabState((currentTab) => (currentTab === nextTab ? currentTab : nextTab))
  }, [searchParams])

  useEffect(() => {
    let isMounted = true
    const loadDestinations = async () => {
      setDestinationsLoading(true)
      try {
        const data = await apiRequest('/destinations')
        if (isMounted) setDestinations(Array.isArray(data) ? data : [])
      } catch {
        if (isMounted) setDestinations([])
      } finally {
        if (isMounted) setDestinationsLoading(false)
      }
    }

    loadDestinations()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredTrips = useMemo(() => {
    let list = activeTab === 'past' ? [...pastTrips] : [...availableTrips]

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      list = list.filter(
        (trip) => {
          const title = t(`groupTrips.data.${trip.id}.title`, {
            fallback: localizeGroupTripValue(language, 'titles', trip.title),
          })
          const city = t(`groupTrips.data.${trip.id}.city`, {
            fallback: localizeGroupTripValue(language, 'cities', trip.city),
          })
          const destination = t(`groupTrips.data.${trip.id}.destination`, {
            fallback: localizeGroupTripValue(language, 'destinations', trip.destination),
          })
          const description = t(`groupTrips.data.${trip.id}.description`, {
            fallback: localizeGroupTripValue(language, 'descriptions', trip.description),
          })

          return (
            trip.title.toLowerCase().includes(query) ||
            trip.city.toLowerCase().includes(query) ||
            trip.destination.toLowerCase().includes(query) ||
            trip.description.toLowerCase().includes(query) ||
            title.toLowerCase().includes(query) ||
            city.toLowerCase().includes(query) ||
            destination.toLowerCase().includes(query) ||
            description.toLowerCase().includes(query)
          )
        }
      )
    }

    list.sort((a, b) => {
      const first = getTripDateAtStartOfDay(getTripStartValue(a))?.getTime() ?? 0
      const second = getTripDateAtStartOfDay(getTripStartValue(b))?.getTime() ?? 0
      return activeTab === 'past' ? second - first : first - second
    })

    return list
  }, [activeTab, availableTrips, language, pastTrips, searchQuery, t])

  const handleTabChange = useCallback(
    (nextTab) => {
      const normalizedTab = normalizeGroupTripsTab(nextTab)
      setActiveTabState(normalizedTab)

      const nextParams = new URLSearchParams(searchParams)
      if (normalizedTab === DEFAULT_TAB) {
        nextParams.delete('tab')
      } else {
        nextParams.set('tab', normalizedTab)
      }

      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  return (
    <div className="home groupTripsPage" dir={dir}>
      <Header />

      <main className="groupTripsMain">
        <GroupTripsHero />

        <GroupTripsSearch query={searchQuery} setQuery={setSearchQuery} />

        <GroupTripsTabs activeTab={activeTab} setActiveTab={handleTabChange} />

        {activeTab === 'create' ? (
          <CreateGroupTripForm
            destinations={destinations}
            destinationsLoading={destinationsLoading}
            onCreated={fetchTrips}
          />
        ) : (
          <GroupTripsGrid
            trips={filteredTrips}
            activeTab={activeTab}
            isLoading={isLoading}
            loadError={loadError}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}

export default GroupTrips
