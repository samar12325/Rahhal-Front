import logo from '../../../assets/images/rahhal-logo.png'
import { useLanguage } from '../../../i18n/LanguageContext'
import { Link } from 'react-router-dom'

const X_URL = 'https://x.com/rahhalweb?s=11&t=HpviNSILl07UsXDxa6vWTA'
const LINKEDIN_URL =
  'https://www.linkedin.com/in/rahal-website-108160406'

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
          <strong className="footerTitle">{t('home.footer.help')}</strong>
          <div className="footerLinks">
            <Link to="/how-to-start">{t('home.footer.links.how')}</Link>
            <Link to="/faq">{t('home.footer.links.faq')}</Link>
            <Link to="/contact">{t('home.footer.links.contact')}</Link>
          </div>
        </div>

        <div className="footerBlock">
          <strong className="footerTitle">{t('home.footer.contact')}</strong>
          <div className="footerContact">
            <a href="mailto:swe.uqu26@gmail.com">swe.uqu26@gmail.com</a>
            <span>{t('home.footer.contactHours')}</span>
          </div>
          <div className="footerSocial">
            <a
              className="socialBtn"
              href={X_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="X"
            >
              X
            </a>
            <a
              className="socialBtn"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              LI
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
