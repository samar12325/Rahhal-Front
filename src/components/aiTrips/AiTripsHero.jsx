import { useLanguage } from '../../i18n/LanguageContext'

function AiTripsHero() {
  const { t } = useLanguage()

  return (
    <section className="aiCard aiCardPad aiHero">
      <div>
        <h1 className="aiHeroTitle">{t('aiTrips.hero.title')}</h1>
        <p className="aiHeroText">{t('aiTrips.hero.subtitle')}</p>
      </div>
      <div className="countBadge">{t('aiTrips.hero.badge')}</div>
    </section>
  )
}

export default AiTripsHero
