import { Link } from 'react-router-dom'
import AuthHeader from '../../components/AuthHeader/AuthHeader'
import './Auth.css'
import { useLanguage } from '../../i18n/LanguageContext'

function ForgotPassword() {
  const { t, dir } = useLanguage()

  return (
    <div className="authPage" dir={dir}>
      <AuthHeader />
      <main className="authMain">
        <div className="authCard">
          <div className="authCardHeader">
            <h1 className="authTitle">{t('forgotPassword.title')}</h1>
            <p className="authSubtitle">{t('forgotPassword.subtitle')}</p>
          </div>

          <form className="authForm">
            <div className="formGroup">
              <label htmlFor="email" className="formLabel">
                {t('forgotPassword.emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                className="formInput"
                placeholder={t('forgotPassword.emailPlaceholder')}
                required
              />
            </div>

            <button type="submit" className="authBtn primary">
              {t('forgotPassword.submit')}
            </button>
          </form>

          <div className="authFooter">
            <Link to="/login" className="authLink">
              {t('forgotPassword.backLink')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ForgotPassword
