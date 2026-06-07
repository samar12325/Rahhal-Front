import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../api/client'
import AuthHeader from '../../components/AuthHeader/AuthHeader'
import Footer from '../Home/components/Footer'
import './Auth.css'
import { useLanguage } from '../../i18n/LanguageContext'

function ForgotPassword() {
  const { t, dir } = useLanguage()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email || isSubmitting) return

    try {
      setIsSubmitting(true)
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: { email: email.trim().toLowerCase() },
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="authPage" dir={dir}>
      <AuthHeader />
      <main className="authMain">
        <div className="authCard">
          <div className="authCardHeader">
            <h1 className="authTitle">{t('forgotPassword.title')}</h1>
            <p className="authSubtitle">{t('forgotPassword.subtitle')}</p>
          </div>

          <form className="authForm" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="email" className="formLabel">
                {t('forgotPassword.emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                className="formInput"
                placeholder={t('forgotPassword.emailPlaceholder')}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
      <Footer />
    </div>
  )
}

export default ForgotPassword
