import GroupTripCard from './GroupTripCard'
import { useLanguage } from '../../i18n/LanguageContext'

function GroupTripsGrid({ trips, activeTab }) {
  const { t } = useLanguage()
  if (!trips.length) {
    return (
      <section className="groupTripsEmpty">
        <h3>{t('groupTrips.empty.title')}</h3>
        <p>
          {activeTab === 'available'
            ? t('groupTrips.empty.available')
            : t('groupTrips.empty.upcoming')}
        </p>
      </section>
    )
  }

  return (
    <section className="groupTripsGrid" aria-label={t('groupTrips.grid.ariaLabel')}>
      {trips.map((trip) => (
        <GroupTripCard key={trip.id} trip={trip} />
      ))}
    </section>
  )
}

export default GroupTripsGrid
