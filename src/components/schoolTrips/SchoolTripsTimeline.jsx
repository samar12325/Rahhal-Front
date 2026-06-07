import SchoolTripCard from './SchoolTripCard'
import { useLanguage } from '../../i18n/LanguageContext'

function SchoolTripsTimeline({
  activeTripTab,
  onTabChange,
  currentTrips,
  pastTrips,
  onViewReport,
  onDownloadSummary,
  onApprovalsChanged,
}) {
  const { t } = useLanguage()
  const isCurrentTab = activeTripTab === 'current'
  const displayedTrips = isCurrentTab ? currentTrips : pastTrips

  return (
    <section className="schoolCard schoolTripsTimeline">
      <div className="schoolTripsTimelineHead">
        <div>
          <h2>{isCurrentTab ? t('schoolTrips.timeline.upcomingTitle') : t('schoolTrips.timeline.pastTitle')}</h2>
          <p>{isCurrentTab ? t('schoolTrips.timeline.upcomingSubtitle') : t('schoolTrips.timeline.pastSubtitle')}</p>
        </div>
        <div className="schoolTripsTabs">
          <button
            className={`schoolTab ${isCurrentTab ? 'active' : ''}`}
            type="button"
            onClick={() => onTabChange('current')}
          >
            {t('schoolTrips.timeline.tabUpcoming', { params: { count: currentTrips.length } })}
          </button>
          <button
            className={`schoolTab ${!isCurrentTab ? 'active' : ''}`}
            type="button"
            onClick={() => onTabChange('past')}
          >
            {t('schoolTrips.timeline.tabPast', { params: { count: pastTrips.length } })}
          </button>
        </div>
      </div>

      <div className="schoolTripsList">
        {displayedTrips.length ? (
          displayedTrips.map((trip) => (
            <SchoolTripCard
              key={trip.id}
              trip={trip}
              onViewReport={onViewReport}
              onDownloadSummary={onDownloadSummary}
              onApprovalsChanged={onApprovalsChanged}
            />
          ))
        ) : (
          <div className="schoolTripEmpty">{t('schoolTrips.timeline.empty')}</div>
        )}
      </div>
    </section>
  )
}

export default SchoolTripsTimeline
