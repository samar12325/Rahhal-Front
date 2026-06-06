import { Link } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import { getTripBadgeKey, getTripCityKey } from '../../i18n/tripsMappings'

function TripCard({ trip }) {
  const { t } = useLanguage()
  const bookingParams = new URLSearchParams()
  bookingParams.set('tripId', trip.id)

  if (trip.destinationId) bookingParams.set('destinationId', trip.destinationId)
  if (trip.activityId) bookingParams.set('activityId', trip.activityId)

  const bookingUrl = `/booking?${bookingParams.toString()}`
  const detailsUrl = trip.destinationId ? `/destinations/${trip.destinationId}` : '/trips'
  const title = t(`trips.data.${trip.id}.title`, { fallback: trip.title })
  const cityKey = getTripCityKey(trip.city)
  const cityLabel = t(`trips.cities.${cityKey}`, { fallback: trip.city })
  const currency = t('trips.currency', { fallback: 'ر.س' })

  return (
    <article className="tripCard">
      <div className="tripImg">
        <img src={trip.image} alt={title} />
      </div>

      <div className="tripBody">
        <div className="tripHeader">
          <h3 className="tripTitle">{title}</h3>
          <p className="tripLocation">{cityLabel}</p>
        </div>

        <div className="tripMeta">
          <span className="tripMetaItem">
            {trip.price} {currency}
          </span>
          {trip.rating ? (
            <span className="tripMetaItem">
              {t('trips.meta.ratingLabel', { params: { rating: trip.rating } })}
            </span>
          ) : null}
        </div>

        {trip.badges?.length ? (
          <div className="tags">
            {trip.badges.slice(0, 3).map((badge, index) => (
              <span className="tag" key={`${trip.id}-badge-${index}`}>
                {t(`trips.badges.${getTripBadgeKey(badge)}`, { fallback: badge })}
              </span>
            ))}
          </div>
        ) : null}

        <div className="tripActions">
          <Link className="primaryBtn" to={bookingUrl}>
            {t('trips.actions.bookNow')}
          </Link>
          <Link className="secondaryBtn tripDetailsBtn" to={detailsUrl}>
            {t('trips.actions.details')}
          </Link>
        </div>
      </div>
    </article>
  )
}

export default TripCard
