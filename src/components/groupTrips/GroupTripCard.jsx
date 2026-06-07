import { Link } from 'react-router-dom'
import { useState } from 'react'
import { buildLoginRedirectPath, isAuthenticated } from '../../auth/session'
import { useLanguage } from '../../i18n/LanguageContext'
import rahhalLogo from '../../assets/images/rahhal-logo.png'
import { localizeGroupTripValue } from './groupTripsLocale'

const DEFAULT_CHECKOUT_TIME = '11:00'
const DEFAULT_CHECKOUT_PEOPLE = '1'

const getCheckoutDate = (value) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) {
    return value
  }

  return new Date().toISOString().slice(0, 10)
}

const getTripDateAtStartOfDay = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  date.setHours(0, 0, 0, 0)
  return date
}

function GroupTripCard({ trip }) {
  const { t, language } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleDetails = (e) => {
    e.preventDefault()
    setIsExpanded((prev) => !prev)
  }

  const formatDate = (value) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    const locale = language === 'ar' ? 'ar-SA' : 'en-US'
    return date.toLocaleDateString(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

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
  const dateLabel = formatDate(trip.date)
  const tripDate = getTripDateAtStartOfDay(trip.start_datetime || trip.startDate || trip.date)
  const today = getTripDateAtStartOfDay(new Date())
  const isPastTrip = Boolean(trip.isPastTrip) || Boolean(trip.is_past) || (tripDate && today ? tripDate < today : false)
  const capacity = Number(trip.capacity ?? trip.maxParticipants ?? 0)
  const joinedCount = Number(trip.joinedCount ?? trip.currentParticipants ?? 0)
  const allowsJoinByStatus = ['open', 'available'].includes(String(trip.rawStatus || trip.status || '').toLowerCase())
  const hasCapacity = capacity <= 0 || joinedCount < capacity
  const canJoin = Boolean(trip.canJoin) && !isPastTrip && allowsJoinByStatus && hasCapacity
  const checkoutParams = new URLSearchParams()
  const checkoutDate = getCheckoutDate(trip.date)

  if (trip.destinationId) checkoutParams.set('destinationId', trip.destinationId)
  if (trip.id) checkoutParams.set('tripId', trip.id)
  checkoutParams.set('date', checkoutDate)
  checkoutParams.set('time', DEFAULT_CHECKOUT_TIME)
  checkoutParams.set('people', DEFAULT_CHECKOUT_PEOPLE)

  const checkoutUrl = `/checkout?${checkoutParams.toString()}`
  const joinUrl = isAuthenticated() ? checkoutUrl : buildLoginRedirectPath(checkoutUrl)

  return (
    <article className="groupTripCard">
      <div className="groupTripImg">
        {trip.image ? (
          <img
            src={trip.image}
            alt={title}
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = rahhalLogo
            }}
          />
        ) : (
          <div className="groupTripImgPlaceholder" />
        )}
        {!isPastTrip && trip.status === 'upcoming' && (
          <div className="groupTripStatusBadge upcoming">
            {t('groupTrips.card.status.upcoming')}
          </div>
        )}
        {canJoin && (
          <div className="groupTripStatusBadge">
            {t('groupTrips.card.status.available')}
          </div>
        )}
      </div>

      <div className="groupTripBody">
        <div>
          <h3 className="groupTripTitle">{title}</h3>
          <div className="groupTripMeta">
            <span>{city}</span>
            {destination && (
              <>
                <span>•</span>
                <span>{destination}</span>
              </>
            )}
            {dateLabel && (
              <>
                <span>•</span>
                <span>{dateLabel}</span>
              </>
            )}
            {trip.price && (
              <>
                <span>•</span>
                <span>
                  {trip.price} {t('groupTrips.currency')}
                </span>
              </>
            )}
          </div>
          <div className="groupTripParticipants">
            <span className="groupTripParticipantsIcon" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span>
              {t('groupTrips.card.participants', {
                params: {
                  current: trip.currentParticipants,
                  max: trip.maxParticipants,
                },
              })}
            </span>
          </div>
        </div>

        {isExpanded && description && (
          <div className="groupTripDetails">
            <p className="groupTripDescription">{description}</p>
          </div>
        )}

        <div className="groupTripActions">
          {canJoin ? (
            <Link className="primaryBtn" to={joinUrl}>
              {t('groupTrips.card.join')}
            </Link>
          ) : null}
          <button
            type="button"
            className={`secondaryBtn ${isExpanded ? 'active' : ''}`}
            onClick={toggleDetails}
          >
            {isExpanded ? t('groupTrips.card.hideDetails') : t('groupTrips.card.details')}
          </button>
        </div>
      </div>
    </article>
  )
}

export default GroupTripCard
