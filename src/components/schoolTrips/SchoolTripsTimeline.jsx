import SchoolTripCard from './SchoolTripCard'
import { useLanguage } from '../../i18n/LanguageContext'

function SchoolTripsTimeline({ upcomingTrips, pastTrips, activeTab, onTabChange }) {
  const { t } = useLanguage()
  const isUpcoming = activeTab === 'upcoming'
  const list = isUpcoming ? upcomingTrips : pastTrips

  return (
    <section className="schoolCard schoolTripsTimeline">
      <div className="schoolTripsTimelineHead">
        <div>
          <h2>{isUpcoming ? t('schoolTrips.timeline.upcomingTitle') : t('schoolTrips.timeline.pastTitle')}</h2>
          <p>
            {isUpcoming
              ? t('schoolTrips.timeline.upcomingSubtitle')
              : t('schoolTrips.timeline.pastSubtitle')}
          </p>
        </div>
        <div className="schoolTripsTabs" role="tablist">
          <button
            className={`schoolTab ${isUpcoming ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={isUpcoming}
            onClick={() => onTabChange('upcoming')}
          >
            {t('schoolTrips.timeline.tabUpcoming', { params: { count: upcomingTrips.length } })}
          </button>
          <button
            className={`schoolTab ${!isUpcoming ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={!isUpcoming}
            onClick={() => onTabChange('past')}
          >
            {t('schoolTrips.timeline.tabPast', { params: { count: pastTrips.length } })}
          </button>
        </div>
      </div>

      <div className="schoolTripsList">
        {list.length ? (
          list.map((trip) => <SchoolTripCard key={trip.id} trip={trip} />)
        ) : (
          <div className="schoolTripEmpty">{t('schoolTrips.timeline.empty')}</div>
        )}
      </div>
    </section>
  )
}

export default SchoolTripsTimeline
