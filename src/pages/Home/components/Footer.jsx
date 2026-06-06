import logo from '../../../assets/images/rahhal-logo.png'
import { useLanguage } from '../../../i18n/LanguageContext'

function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer" id="contact">
      <div className="container footerInner">
        <div className="footerBrand">
          <img className="footerLogo" src={logo} alt={t('header.logoAlt')} />
          <p className="footerText">
            {t('home.footer.brandText')}
          </p>
        </div>

        <div className="footerBlock">
          <strong className="footerTitle">{t('home.footer.quickLinks')}</strong>
          <div className="footerLinks">
            <a href="#destinations">{t('home.footer.links.destinations')}</a>
            <a href="#offers">{t('home.footer.links.offers')}</a>
            <a href="#trip-types">{t('home.footer.links.tripTypes')}</a>
          </div>
        </div>

        <div className="footerBlock">
          <strong className="footerTitle">{t('home.footer.help')}</strong>
          <div className="footerLinks">
            <a href="#how">{t('home.footer.links.how')}</a>
            <a href="#faq">{t('home.footer.links.faq')}</a>
            <a href="#contact">{t('home.footer.links.contact')}</a>
          </div>
        </div>

        <div className="footerBlock">
          <strong className="footerTitle">{t('home.footer.contact')}</strong>
          <div className="footerContact">
            <span>info@rahhal.sa</span>
            <span>{t('home.footer.contactHours')}</span>
          </div>
          <div className="footerSocial">
            <a className="socialBtn" href="https://x.com" aria-label="X">
              X
            </a>
            <a className="socialBtn" href="https://instagram.com" aria-label="Instagram">
              IG
            </a>
            <a className="socialBtn" href="https://snapchat.com" aria-label="Snapchat">
              SC
            </a>
          </div>
        </div>
      </div>

      <div className="container footerBottom">
        <span>{t('home.footer.rights')}</span>
        <span className="muted">{t('home.footer.legal')}</span>
      </div>
    </footer>
  )
}

export default Footer
