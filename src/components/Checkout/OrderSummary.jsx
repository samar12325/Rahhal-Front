import { useLanguage } from '../../i18n/LanguageContext'

function OrderSummary({ destination, activity, offer, pricing, trip, bookingDetails }) {
  const { t, language } = useLanguage()
  const locale = language === 'ar' ? 'ar-SA' : 'en-US'
  const formatter = new Intl.NumberFormat(locale)
  const currency = t('checkout.currency', { fallback: 'SAR' })

  const formatPrice = (value) => {
    if (!value) return t('checkout.priceUnavailable')
    return `${formatter.format(value)} ${currency}`
  }

  const formatDate = (value) => {
    if (!value) return ''
    try {
      return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(value))
    } catch {
      return value
    }
  }

  const formatTime = (value) => {
    if (!value) return ''
    const [hours = '0', minutes = '0'] = value.split(':')
    const date = new Date()
    date.setHours(Number(hours), Number(minutes), 0, 0)

    try {
      return new Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        minute: 'numeric',
      }).format(date)
    } catch {
      return value
    }
  }

  const hasOffer = Boolean(offer)
  const hasActivity = Boolean(destination && activity)
  const hasTrip = Boolean(trip)

  const bookingRows = [
    bookingDetails?.date
      ? { label: t('checkout.summary.booking.date'), value: formatDate(bookingDetails.date) }
      : null,
    bookingDetails?.time
      ? { label: t('checkout.summary.booking.time'), value: formatTime(bookingDetails.time) }
      : null,
    bookingDetails?.people
      ? { label: t('checkout.summary.booking.people'), value: bookingDetails.people }
      : null,
  ].filter(Boolean)

  const offerTitle = offer
    ? t(`offers.data.${offer.id}.title`, { fallback: offer.title })
    : ''
  const offerDestination = offer
    ? t(`offers.data.${offer.id}.destination`, { fallback: offer.destination })
    : ''
  const offerDuration = offer
    ? t(`offers.data.${offer.id}.duration`, { fallback: offer.duration })
    : ''
  const destinationName = destination
    ? t(`destinationNames.${destination.id}`, { fallback: destination.name })
    : ''
  const vatPercent = 15

  return (
    <div className="orderSummary">
      <h3>{t('checkout.summary.title')}</h3>

      {hasTrip ? (
        <div className="summaryHeader">
          <img src={trip.image} alt={trip.title} />
          <div>
            <p className="summaryDestination">{trip.city}</p>
            <p className="summaryActivity">{trip.title}</p>
            {trip.rating ? (
              <p className="summaryMeta">
                {t('checkout.summary.rating', { params: { rating: trip.rating } })}
              </p>
            ) : null}
          </div>
        </div>
      ) : hasOffer ? (
        <div className="summaryHeader">
          <img src={offer.image} alt={offerTitle} />
          <div>
            <p className="summaryDestination">{offerDestination}</p>
            <p className="summaryActivity">{offerTitle}</p>
            <p className="summaryMeta">{offerDuration}</p>
          </div>
        </div>
      ) : hasActivity ? (
        <div className="summaryHeader">
          <img src={activity.image} alt={activity.title} />
          <div>
            <p className="summaryDestination">{destinationName}</p>
            <p className="summaryActivity">{activity.title}</p>
            <p className="summaryMeta">{activity.duration}</p>
          </div>
        </div>
      ) : (
        <p className="summaryEmpty">{t('checkout.summary.empty')}</p>
      )}

      {bookingRows.length ? (
        <div className="summaryBooking">
          {bookingRows.map((row) => (
            <div className="summaryBookingRow" key={row.label}>
              <span className="summaryBookingLabel">{row.label}</span>
              <span className="summaryBookingValue">{row.value}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="summaryList">
        <div className="summaryRow">
          <span>{t('checkout.summary.price.base')}</span>
          <span>{formatPrice(pricing.basePrice)}</span>
        </div>
        <div className="summaryRow">
          <span>{t('checkout.summary.price.vat', { params: { percent: vatPercent } })}</span>
          <span>{formatPrice(pricing.tax)}</span>
        </div>
        <div className="summaryRow total">
          <span>{t('checkout.summary.price.total')}</span>
          <span>{formatPrice(pricing.total)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
