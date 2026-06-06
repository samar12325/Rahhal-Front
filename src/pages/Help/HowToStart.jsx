import { Link } from 'react-router-dom'
import PageHero from '../../components/Common/PageHero'
import './HowToStart.css'
import { useLanguage } from '../../i18n/LanguageContext'

function HowToStart() {
  const { t, dir } = useLanguage()
  const steps = [
    { key: 'choose' },
    { key: 'explore' },
    { key: 'plan' },
    { key: 'book', action: { label: t('howToStart.steps.book.action'), to: '/checkout' } },
    { key: 'share' },
  ]

  return (
    <div className="helpPage" dir={dir}>
      <PageHero title={t('howToStart.hero.title')} subtitle={t('howToStart.hero.subtitle')} />

      <section className="helpStepsSection">
        <div className="container helpStepsGrid">
          {steps.map((step, index) => (
            <article className="helpStepCard" key={step.key}>
              <div className="helpStepNumber">{index + 1}</div>
              <h3>{t(`howToStart.steps.${step.key}.title`)}</h3>
              <p>{t(`howToStart.steps.${step.key}.description`)}</p>
              {step.action ? (
                <Link className="helpStepLink" to={step.action.to}>
                  {step.action.label}
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="helpCtaSection">
        <div className="container helpCtaBox">
          <div>
            <h2>{t('howToStart.cta.title')}</h2>
            <p>{t('howToStart.cta.subtitle')}</p>
          </div>
          <Link className="primaryBtn helpCtaBtn" to="/home#destinations">
            {t('howToStart.cta.action')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HowToStart
