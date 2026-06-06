import TripCard from './TripCard'
import { useLanguage } from '../../i18n/LanguageContext'

function TripsGrid({ trips }) {
  const { t } = useLanguage()

  if (!trips.length) {
    return (
      <section className="tripsGrid" aria-label={t('trips.listAria')}>
        <div className="tripCard">
          <div className="tripBody">
            <h3 className="tripTitle">{t('trips.empty.title')}</h3>
            <p className="tripMeta">{t('trips.empty.subtitle')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="tripsGrid" aria-label={t('trips.listAria')}>
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </section>
  )
}

export default TripsGrid
