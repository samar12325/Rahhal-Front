import { useLanguage } from '../../i18n/LanguageContext'

function SchoolTripsHero({ stats }) {
  const { t } = useLanguage()
  return (
    <section className="schoolTripsHero">
      <div className="schoolTripsHeroMain">
        <h1 className="schoolTripsHeroTitle">{t('schoolTrips.hero.title')}</h1>
        <p className="schoolTripsHeroText">{t('schoolTrips.hero.subtitle')}</p>
        <div className="schoolTripsHeroActions">
          <a className="primaryBtn" href="#create-trip">
            {t('schoolTrips.hero.actions.create')}
          </a>
          <a className="secondaryBtn" href="#trip-report">
            {t('schoolTrips.hero.actions.report')}
          </a>
        </div>
      </div>

      <div className="schoolTripsStats">
        <div className="schoolTripsStat">
          <span className="schoolTripsStatValue">{stats.upcoming}</span>
          <span className="schoolTripsStatLabel">{t('schoolTrips.hero.stats.upcoming')}</span>
        </div>
        <div className="schoolTripsStat">
          <span className="schoolTripsStatValue">{stats.past}</span>
          <span className="schoolTripsStatLabel">{t('schoolTrips.hero.stats.past')}</span>
        </div>
        <div className="schoolTripsStat">
          <span className="schoolTripsStatValue">{stats.students}</span>
          <span className="schoolTripsStatLabel">{t('schoolTrips.hero.stats.students')}</span>
        </div>
        <div className="schoolTripsStat">
          <span className="schoolTripsStatValue">{stats.reportsReady}</span>
          <span className="schoolTripsStatLabel">{t('schoolTrips.hero.stats.reports')}</span>
        </div>
      </div>
    </section>
  )
}

export default SchoolTripsHero
