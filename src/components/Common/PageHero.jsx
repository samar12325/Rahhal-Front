import './PageHero.css'

import { useLanguage } from '../../i18n/LanguageContext'

function PageHero({ title, subtitle }) {
  const { t } = useLanguage()
  return (
    <section className="pageHero">
      <div className="container pageHeroInner">
        <div className="pageHeroCard">
          <span className="pageHeroEyebrow">{t('common.brand', { fallback: 'Rahhal' })}</span>
          <h1 className="pageHeroTitle">{title}</h1>
          {subtitle ? <p className="pageHeroSubtitle">{subtitle}</p> : null}
        </div>
      </div>
    </section>
  )
}

export default PageHero
