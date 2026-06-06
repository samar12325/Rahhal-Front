import { Link } from 'react-router-dom'
import PriceBadge from './PriceBadge'

import { useLanguage } from '../../i18n/LanguageContext'

function OfferCard({ offer }) {
  const { t } = useLanguage()
  const bookingUrl = `/checkout?offerId=${offer.id}`
  const title = t(`offers.data.${offer.id}.title`, { fallback: offer.title })
  const destination = t(`offers.data.${offer.id}.destination`, { fallback: offer.destination })
  const duration = t(`offers.data.${offer.id}.duration`, { fallback: offer.duration })
  const includes = offer.includes.slice(0, 3).map((item, index) =>
    t(`offers.data.${offer.id}.includes.${index}`, { fallback: item }),
  )
  const currency = t('offers.currency', { fallback: 'ر.س' })

  return (
    <article className="offerCard">
      <div className="offerImage">
        <img src={offer.image} alt={title} loading="lazy" />
        <PriceBadge percent={offer.discountPercent} />
      </div>

      <div className="offerBody">
        <div className="offerHead">
          <h3 className="offerTitle">{title}</h3>
          <p className="offerMeta">
            {destination} · {duration}
          </p>
        </div>

        <ul className="offerIncludes">
          {includes.map((item, index) => (
            <li key={`${offer.id}-include-${index}`}>{item}</li>
          ))}
        </ul>

        <div className="offerFooter">
          <div className="offerPrices">
            <span className="oldPrice">
              {offer.oldPrice} {currency}
            </span>
            <span className="newPrice">
              {offer.newPrice} {currency}
            </span>
          </div>
          <div className="offerRating">★ {offer.rating}</div>
        </div>

        <div className="offerActions">
          {offer.availability === 'available' ? (
            <Link className="primaryBtn offerBtn" to={bookingUrl}>
              {t('offers.actions.bookNow')}
            </Link>
          ) : (
            <button className="primaryBtn offerBtn disabled" type="button" disabled>
              {t('offers.actions.comingSoon')}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default OfferCard
