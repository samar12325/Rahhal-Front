import { useLanguage } from '../../i18n/LanguageContext'

function SchoolTripCard({ trip }) {
  const { t } = useLanguage()
  const isPast = trip.status === 'past'
  const getTripValue = (field, fallback) =>
    t(`schoolTrips.data.${trip.id}.${field}`, { fallback })

  const title = getTripValue('title', trip.title)
  const destination = getTripValue('destination', trip.destination)
  const date = getTripValue('date', trip.date)
  const time = getTripValue('time', trip.time)
  const grade = getTripValue(
    'grade',
    t(`schoolTrips.grades.${trip.grade}`, { fallback: trip.grade })
  )
  const focus = getTripValue('focus', trip.focus)
  const meetingPoint = getTripValue('meetingPoint', trip.meetingPoint)
  const transport = getTripValue(
    'transport',
    t(`schoolTrips.transports.${trip.transport}`, { fallback: trip.transport })
  )

  return (
    <article className={`schoolTripCard ${isPast ? 'past' : 'upcoming'}`}>
      <header className="schoolTripCardHeader">
        <div className="schoolTripHeadText">
          <span className={`schoolTripStatus ${isPast ? 'past' : 'upcoming'}`}>
            {isPast ? t('schoolTrips.card.statusPast') : t('schoolTrips.card.statusUpcoming')}
          </span>
          <h3 className="schoolTripTitle">{title}</h3>
          <p className="schoolTripDestination">{destination}</p>
        </div>
        <div className="schoolTripDate">
          <span>{date}</span>
          <span>{time}</span>
        </div>
      </header>

      <div className="schoolTripInfo">
        <div className="schoolTripInfoItem">
          <span className="schoolTripLabel">{t('schoolTrips.card.labels.grade')}</span>
          <span className="schoolTripValue">{grade}</span>
        </div>
        <div className="schoolTripInfoItem">
          <span className="schoolTripLabel">{t('schoolTrips.card.labels.students')}</span>
          <span className="schoolTripValue">
            {t('schoolTrips.card.studentsCount', { params: { count: trip.studentsCount } })}
          </span>
        </div>
        <div className="schoolTripInfoItem">
          <span className="schoolTripLabel">{t('schoolTrips.card.labels.supervisors')}</span>
          <span className="schoolTripValue">{trip.supervisorsCount}</span>
        </div>
        <div className="schoolTripInfoItem">
          <span className="schoolTripLabel">{t('schoolTrips.card.labels.focus')}</span>
          <span className="schoolTripValue">{focus}</span>
        </div>
        <div className="schoolTripInfoItem">
          <span className="schoolTripLabel">{t('schoolTrips.card.labels.meetingPoint')}</span>
          <span className="schoolTripValue">{meetingPoint}</span>
        </div>
        <div className="schoolTripInfoItem">
          <span className="schoolTripLabel">{t('schoolTrips.card.labels.transport')}</span>
          <span className="schoolTripValue">{transport}</span>
        </div>
      </div>

      {trip.agenda?.length ? (
        <div className="schoolTripAgenda">
          {trip.agenda.map((item, index) => (
            <span key={`${trip.id}-agenda-${index}`}>
              {t(`schoolTrips.data.${trip.id}.agenda.${index}`, { fallback: item })}
            </span>
          ))}
        </div>
      ) : null}

      {!isPast && (
        <div className="schoolTripProgress">
          <div className="schoolTripProgressHeader">
            <span>{t('schoolTrips.card.progressLabel')}</span>
            <span>{trip.readiness}%</span>
          </div>
          <div className="schoolTripProgressBar">
            <span style={{ width: `${trip.readiness}%` }} />
          </div>
        </div>
      )}

      {isPast && (
        <div className="schoolTripReportStatus">
          {trip.reportReady
            ? t('schoolTrips.card.reportReady')
            : t('schoolTrips.card.reportPending')}
        </div>
      )}

      <div className="schoolTripActions">
        {isPast ? (
          <>
            <button className="secondaryBtn" type="button">
              {t('schoolTrips.card.actions.viewReport')}
            </button>
            <button className="primaryBtn" type="button">
              {t('schoolTrips.card.actions.downloadSummary')}
            </button>
          </>
        ) : (
          <>
            <button className="primaryBtn" type="button">
              {t('schoolTrips.card.actions.confirmPrep')}
            </button>
            <button className="secondaryBtn" type="button">
              {t('schoolTrips.card.actions.taskList')}
            </button>
          </>
        )}
      </div>
    </article>
  )
}

export default SchoolTripCard
