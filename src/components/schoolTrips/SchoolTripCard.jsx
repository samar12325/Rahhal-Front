import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import SchoolTripsParentApprovals from './SchoolTripsParentApprovals'
import {
  localizeSchoolTripGrade,
  localizeSchoolTripMeetingPoint,
  localizeSchoolTripName,
  localizeSchoolTripTitle,
  localizeSchoolTripTransport,
} from './schoolTripsLocale'

function SchoolTripCard({
  trip,
  onViewReport,
  onDownloadSummary,
  onApprovalsChanged,
}) {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [showApprovals, setShowApprovals] = useState(false)
  const isPast = trip.status === 'past'
  const canShowReportActions = isPast && trip.approval !== 'pending'
  const getTripValue = (field, fallback) =>
    t(`schoolTrips.data.${trip.id}.${field}`, { fallback })

  const title = getTripValue('title', localizeSchoolTripTitle(language, trip.title))
  const destination = getTripValue('destination', localizeSchoolTripName(language, trip.destination))
  const date = getTripValue('date', trip.date)
  const time = getTripValue('time', trip.time)
  const grade = getTripValue('grade', localizeSchoolTripGrade(language, trip.grade, t))
  const meetingPoint = getTripValue(
    'meetingPoint',
    localizeSchoolTripMeetingPoint(language, trip.meetingPoint),
  )
  const transport = getTripValue(
    'transport',
    localizeSchoolTripTransport(language, trip.transport, t),
  )

  return (
    <article className={`schoolTripCard ${isPast ? 'past' : 'upcoming'}`}>
      <header className="schoolTripCardHeader">
        <div className="schoolTripHeadText">
          {trip.approval ? (
            <span className={`approvalBadge ${trip.approval}`}>
              {trip.approval === 'approved'
                ? t('schoolTrips.card.approval.approved')
                : trip.approval === 'rejected'
                  ? t('schoolTrips.card.approval.rejected')
                  : t('schoolTrips.card.approval.pending')}
            </span>
          ) : null}
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
          <span className="schoolTripLabel">{t('schoolTrips.card.labels.meetingPoint')}</span>
          <span className="schoolTripValue">{meetingPoint}</span>
        </div>
        <div className="schoolTripInfoItem">
          <span className="schoolTripLabel">{t('schoolTrips.card.labels.transport')}</span>
          <span className="schoolTripValue">{transport}</span>
        </div>
      </div>

      {isPast ? (
        <div className="schoolTripReportStatus">
          {trip.reportReady ? t('schoolTrips.card.reportReady') : t('schoolTrips.card.reportPending')}
        </div>
      ) : null}

      <div className="schoolTripActions">
        {isPast ? (
          canShowReportActions ? (
            <>
              <button
                className="secondaryBtn"
                type="button"
                onClick={() => onViewReport?.(trip.id)}
              >
                {t('schoolTrips.card.actions.viewReport')}
              </button>
              <button
                className="primaryBtn"
                type="button"
                onClick={() => onDownloadSummary?.(trip.id)}
              >
                {t('schoolTrips.card.actions.downloadSummary')}
              </button>
            </>
          ) : null
        ) : (
          <>
            <button
              className="primaryBtn"
              type="button"
              onClick={() => setShowApprovals((prev) => !prev)}
              disabled={!trip.id}
            >
              {t('schoolTrips.card.actions.addStudents', {
                fallback: language === 'ar' ? 'إضافة طلاب' : 'Add students',
              })}
            </button>
            <button
              className="secondaryBtn"
              type="button"
              onClick={() => navigate(`/school-trips/${trip.id}/preparation`)}
              disabled={!trip.id}
            >
              {t('schoolTrips.card.actions.prepareStudents', {
                fallback: language === 'ar' ? 'تحضير الطلاب' : 'Prepare students',
              })}
            </button>
          </>
        )}
      </div>

      {!isPast && showApprovals ? (
        <SchoolTripsParentApprovals
          tripId={trip.id}
          tripName={title}
          embedded
          onApprovalsChanged={onApprovalsChanged}
        />
      ) : null}
    </article>
  )
}

export default SchoolTripCard
