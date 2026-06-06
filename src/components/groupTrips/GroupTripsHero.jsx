import { useLanguage } from '../../i18n/LanguageContext'

function GroupTripsHero() {
  const { t } = useLanguage()
  return (
    <section className="groupTripsHero">
      <div>
        <h1>{t('groupTrips.hero.title')}</h1>
        <p>{t('groupTrips.hero.subtitle')}</p>
      </div>
      <div className="countBadge groupTripsBadge">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
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
        <span>{t('groupTrips.hero.badge')}</span>
      </div>
    </section>
  )
}

export default GroupTripsHero
