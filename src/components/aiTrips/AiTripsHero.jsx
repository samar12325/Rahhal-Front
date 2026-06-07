import { useLanguage } from '../../i18n/LanguageContext'

function AiTripsHero() {
  const { t } = useLanguage()

  return (
    <section className="aiCard aiCardPad aiHero">
      <div>
        <h1 className="aiHeroTitle">{t('aiTrips.hero.title')}</h1>
        <p className="aiHeroText">{t('aiTrips.hero.subtitle')}</p>
      </div>
      <div className="countBadge aiHeroBadge">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M14 2.5L8.5 13H13L10.5 21.5L18 10.5H13.5L14 2.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{t('aiTrips.hero.badge')}</span>
      </div>
    </section>
  )
}

export default AiTripsHero
