import logo from '../../assets/images/rahhal-logo.png'
import { useLanguage } from '../../i18n/LanguageContext'

function AuthHeader() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="authHeader">
      <div className="authHeaderInner">
        <a className="authBrand" href="/home" aria-label={t('header.brandLabel')}>
          <img className="authLogo" src={logo} alt={t('header.logoAlt')} />
        </a>

        <div className="langToggle" role="group" aria-label={t('header.languageToggle')}>
          <button
            type="button"
            className={`langBtn ${language === 'en' ? 'active' : ''}`}
            aria-pressed={language === 'en'}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
          <span className="langDivider" aria-hidden="true">|</span>
          <button
            type="button"
            className={`langBtn ${language === 'ar' ? 'active' : ''}`}
            aria-pressed={language === 'ar'}
            onClick={() => setLanguage('ar')}
          >
            AR
          </button>
        </div>
      </div>
    </header>
  )
}

export default AuthHeader
