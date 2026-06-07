import GroupTripCard from './GroupTripCard'
import { useLanguage } from '../../i18n/LanguageContext'

function GroupTripsGrid({ trips, activeTab, isLoading = false, loadError = '' }) {
  const { t } = useLanguage()
  if (isLoading) {
    return (
      <section className="groupTripsEmpty">
        <h3>{t('groupTrips.empty.title')}</h3>
        <p>{t('groupTrips.loading', { fallback: 'جاري تحميل الرحلات...' })}</p>
      </section>
    )
  }

  if (loadError) {
    return (
      <section className="groupTripsEmpty">
        <h3>{t('groupTrips.empty.title')}</h3>
        <p>{loadError}</p>
      </section>
    )
  }

  if (!trips.length) {
    return (
      <section className="groupTripsEmpty">
        <h3>{t('groupTrips.empty.title')}</h3>
        <p>
          {activeTab === 'available'
            ? t('groupTrips.empty.available')
            : t('groupTrips.empty.past')}
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
