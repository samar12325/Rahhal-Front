import { useLanguage } from '../../i18n/LanguageContext'

function AiAssistantGuide() {
  const { t } = useLanguage()
  const promptKeys = ['compare', 'family', 'weekend', 'coolWeather']

  return (
    <section className="aiCard aiCardPad">
      <h2 className="aiFormTitle">{t('aiTrips.assistantGuide.title')}</h2>
      <p className="historyText">{t('aiTrips.assistantGuide.subtitle')}</p>

      <div className="assistantExamples">
        {promptKeys.map((key) => (
          <div className="assistantExample" key={key}>
            {t(`aiTrips.assistantGuide.examples.${key}`)}
          </div>
        ))}
      </div>
    </section>
  )
}

export default AiAssistantGuide
