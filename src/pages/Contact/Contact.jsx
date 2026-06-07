import PageHero from '../../components/Common/PageHero'
import ContactForm from '../../components/Contact/ContactForm'
import './Contact.css'
import { useLanguage } from '../../i18n/LanguageContext'

const X_URL = 'https://x.com/rahhalweb?s=11&t=HpviNSILl07UsXDxa6vWTA'
const LINKEDIN_URL =
  'https://www.linkedin.com/in/rahal-website-108160406'

function Contact() {
  const { t, dir } = useLanguage()

  return (
    <div className="contactPage" dir={dir}>
      <PageHero
        title={t('contact.hero.title')}
        subtitle={t('contact.hero.subtitle')}
      />

      <section className="contactSection">
        <div className="container contactGrid">
          <div className="contactCard">
            <h2>{t('contact.cards.messageTitle')}</h2>
            <p className="contactText">{t('contact.cards.messageSubtitle')}</p>
            <ContactForm />
          </div>

          <aside className="contactCard contactInfo">
            <h2>{t('contact.cards.infoTitle')}</h2>
            <div className="contactInfoList">
              <div>
                <span className="contactLabel">{t('contact.info.emailLabel')}</span>
                <p>
                  <a href={`mailto:${t('contact.info.emailValue')}`}>
                    {t('contact.info.emailValue')}
                  </a>
                </p>
              </div>
              <div>
                <span className="contactLabel">{t('contact.info.hoursLabel')}</span>
                <p>{t('contact.info.hoursValue')}</p>
              </div>
              <div>
                <span className="contactLabel">{t('contact.info.followLabel')}</span>
                <div className="contactSocial">
                  <a href={X_URL} target="_blank" rel="noreferrer">
                    {t('contact.info.socials.x')}
                  </a>
                  <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                    {t('contact.info.socials.linkedin')}
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default Contact
