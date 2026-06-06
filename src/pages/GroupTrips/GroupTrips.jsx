import { useState, useMemo } from 'react'
import '../Home/Home.css'
import './GroupTrips.css'
import Header from '../Home/components/Header'
import Footer from '../Home/components/Footer'
import GroupTripsHero from '../../components/groupTrips/GroupTripsHero'
import GroupTripsSearch from '../../components/groupTrips/GroupTripsSearch'
import GroupTripsTabs from '../../components/groupTrips/GroupTripsTabs'
import GroupTripsGrid from '../../components/groupTrips/GroupTripsGrid'
import CreateGroupTripForm from '../../components/groupTrips/CreateGroupTripForm'
import { groupTrips } from '../../data/groupTrips.mock'
import { useLanguage } from '../../i18n/LanguageContext'

function GroupTrips() {
  const { t, dir } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('available')

  const filteredTrips = useMemo(() => {
    let trips = [...groupTrips]

    // Filter by tab
    if (activeTab === 'available') {
      trips = trips.filter((trip) => trip.status === 'available')
    } else if (activeTab === 'upcoming') {
      trips = trips.filter((trip) => trip.status === 'upcoming')
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      trips = trips.filter(
        (trip) =>
          trip.title.toLowerCase().includes(query) ||
          trip.city.toLowerCase().includes(query) ||
          trip.destination.toLowerCase().includes(query) ||
          t(`groupTrips.data.${trip.id}.title`, { fallback: trip.title })
            .toLowerCase()
            .includes(query) ||
          t(`groupTrips.data.${trip.id}.city`, { fallback: trip.city })
            .toLowerCase()
            .includes(query) ||
          t(`groupTrips.data.${trip.id}.destination`, { fallback: trip.destination })
            .toLowerCase()
            .includes(query)
      )
    }

    // Sort upcoming trips by date
    if (activeTab === 'upcoming') {
      trips.sort((a, b) => new Date(a.date) - new Date(b.date))
    }

    return trips
  }, [searchQuery, activeTab, t])

  return (
    <div className="home groupTripsPage" dir={dir}>
      <Header />

      <main className="groupTripsMain">
        <GroupTripsHero />

        <GroupTripsSearch query={searchQuery} setQuery={setSearchQuery} />

        <GroupTripsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'create' ? (
          <CreateGroupTripForm />
        ) : (
          <GroupTripsGrid trips={filteredTrips} activeTab={activeTab} />
        )}
      </main>

      <Footer />
    </div>
  )
}

export default GroupTrips
