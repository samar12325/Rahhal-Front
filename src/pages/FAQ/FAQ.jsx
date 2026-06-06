import PageHero from '../../components/Common/PageHero'
import FAQItem from '../../components/FAQ/FAQItem'
import './FAQ.css'
import { useLanguage } from '../../i18n/LanguageContext'

function FAQ() {
  const { t, dir } = useLanguage()
  const faqs = [
    'payment',
    'booking',
    'suggestions',
    'groupTrips',
    'schoolTrips',
    'editPlan',
    'tickets',
    'support',
  ]

  return (
    <div className="faqPage" dir={dir}>
      <PageHero title={t('faq.hero.title')} subtitle={t('faq.hero.subtitle')} />

      <section className="faqSection">
        <div className="container faqList">
          {faqs.map((key, index) => (
            <FAQItem
              key={key}
              question={t(`faq.items.${key}.question`)}
              answer={t(`faq.items.${key}.answer`)}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default FAQ
