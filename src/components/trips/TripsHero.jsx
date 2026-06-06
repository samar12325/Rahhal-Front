import { useLanguage } from '../../i18n/LanguageContext'

function TripsHero({ count }) {
  const { t } = useLanguage()

  return (
    <section className="tripsHero">
      <div>
        <h1>{t('trips.hero.title')}</h1>
        <p>{t('trips.hero.subtitle')}</p>
      </div>
      <div className="countBadge">
        {t('trips.hero.countLabel', { params: { count } })}
      </div>
    </section>
  )
}

export default TripsHero
