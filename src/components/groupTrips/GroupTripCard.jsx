import { useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'

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

  const title = t(`groupTrips.data.${trip.id}.title`, { fallback: trip.title })
  const city = t(`groupTrips.data.${trip.id}.city`, { fallback: trip.city })
  const destination = t(`groupTrips.data.${trip.id}.destination`, { fallback: trip.destination })
  const description = t(`groupTrips.data.${trip.id}.description`, { fallback: trip.description })
  const dateLabel = formatDate(trip.date)

  return (
    <article className="groupTripCard">
      <div className="groupTripImg">
        {trip.image ? (
          <img src={trip.image} alt={title} />
        ) : (
          <div className="groupTripImgPlaceholder" />
        )}
        {trip.status === 'upcoming' && (
          <div className="groupTripStatusBadge upcoming">
            {t('groupTrips.card.status.upcoming')}
          </div>
        )}
        {trip.status === 'available' && (
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
            <span>👥</span>
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
          <a className="primaryBtn" href={`/group-trips/${trip.id}`}>
            {t('groupTrips.card.join')}
          </a>
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
