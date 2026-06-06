import { useLanguage } from '../../i18n/LanguageContext'

function SchoolTripsReport({ reports, selectedId, onSelect }) {
  const { t } = useLanguage()
  const selectedTrip = reports.find((trip) => trip.id === selectedId) || reports[0]
  const getTripValue = (field, fallback) =>
    selectedTrip
      ? t(`schoolTrips.data.${selectedTrip.id}.${field}`, { fallback })
      : fallback

  const title = selectedTrip ? getTripValue('title', selectedTrip.title) : ''
  const destination = selectedTrip
    ? getTripValue('destination', selectedTrip.destination)
    : ''
  const date = selectedTrip ? getTripValue('date', selectedTrip.date) : ''
  const grade = selectedTrip
    ? getTripValue(
        'grade',
        t(`schoolTrips.grades.${selectedTrip.grade}`, { fallback: selectedTrip.grade })
      )
    : ''
  const summary = selectedTrip
    ? getTripValue('report.summary', selectedTrip.report?.summary)
    : ''
  const attendance = selectedTrip
    ? getTripValue('report.attendance', selectedTrip.report?.attendance)
    : ''
  const highlights = selectedTrip?.report?.highlights?.map((item, index) =>
    t(`schoolTrips.data.${selectedTrip.id}.report.highlights.${index}`, { fallback: item })
  )
  const learningOutcomes = selectedTrip?.report?.learningOutcomes?.map((item, index) =>
    t(`schoolTrips.data.${selectedTrip.id}.report.learningOutcomes.${index}`, { fallback: item })
  )
  const nextSteps = selectedTrip?.report?.nextSteps?.map((item, index) =>
    t(`schoolTrips.data.${selectedTrip.id}.report.nextSteps.${index}`, { fallback: item })
  )
  const agenda = selectedTrip?.agenda?.map((item, index) =>
    t(`schoolTrips.data.${selectedTrip.id}.agenda.${index}`, { fallback: item })
  )

  return (
    <section className="schoolCard schoolTripsReport" id="trip-report">
      <div className="schoolTripsReportHead">
        <div>
          <h2>{t('schoolTrips.report.title')}</h2>
          <p>{t('schoolTrips.report.subtitle')}</p>
        </div>
        {reports.length ? (
          <div className="schoolTripsReportSelect">
            <label className="schoolTripsLabel" htmlFor="report-trip">
              {t('schoolTrips.report.selectLabel')}
            </label>
            <select
              id="report-trip"
              className="schoolSelect"
              value={selectedTrip?.id ?? ''}
              onChange={(event) => onSelect(event.target.value)}
            >
              {reports.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {t(`schoolTrips.data.${trip.id}.title`, { fallback: trip.title })}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {!reports.length ? (
        <div className="schoolReportEmpty">
          {t('schoolTrips.report.empty')}
        </div>
      ) : (
        <div className="schoolTripsReportBody">
          <div className="schoolReportSummary">
            <div className="schoolReportSummaryHead">
              <div>
                <h3>{title}</h3>
                <p>{destination}</p>
              </div>
              <span className="schoolReportBadge">{t('schoolTrips.report.badge')}</span>
            </div>
            <p>{summary}</p>
            <div className="schoolReportMeta">
              <span>
                {t('schoolTrips.report.meta.date', { params: { value: date } })}
              </span>
              <span>
                {t('schoolTrips.report.meta.grade', { params: { value: grade } })}
              </span>
              <span>
                {t('schoolTrips.report.meta.attendance', { params: { value: attendance } })}
              </span>
            </div>
          </div>

          <div className="schoolReportGrid">
            <div className="schoolReportCard">
              <h4>{t('schoolTrips.report.sections.highlights')}</h4>
              <ul className="schoolReportList">
                {highlights?.map((item, index) => (
                  <li key={`${selectedTrip.id}-highlight-${index}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="schoolReportCard">
              <h4>{t('schoolTrips.report.sections.learningOutcomes')}</h4>
              <ul className="schoolReportList">
                {learningOutcomes?.map((item, index) => (
                  <li key={`${selectedTrip.id}-outcome-${index}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="schoolReportCard">
              <h4>{t('schoolTrips.report.sections.nextSteps')}</h4>
              <ul className="schoolReportList">
                {nextSteps?.map((item, index) => (
                  <li key={`${selectedTrip.id}-next-${index}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="schoolReportCard">
              <h4>{t('schoolTrips.report.sections.agenda')}</h4>
              <ul className="schoolReportList">
                {agenda?.map((item, index) => (
                  <li key={`${selectedTrip.id}-agenda-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="schoolReportActions">
            <button className="primaryBtn" type="button">
              {t('schoolTrips.report.actions.download')}
            </button>
            <button className="secondaryBtn" type="button">
              {t('schoolTrips.report.actions.copy')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default SchoolTripsReport
