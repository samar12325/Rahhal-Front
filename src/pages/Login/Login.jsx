import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../../api/client'
import { persistUser } from '../../auth/session'
import AuthHeader from '../../components/AuthHeader/AuthHeader'
import Footer from '../Home/components/Footer'
import './Auth.css'
import { useLanguage } from '../../i18n/LanguageContext'

function Login() {
  const { t, dir } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email || !password) return

    try {
      setIsSubmitting(true)
      const payload = await apiRequest('/auth/login', {
        method: 'POST',
        body: {
          email: email.trim().toLowerCase(),
          password,
        },
      })

      const normalizedUser = {
        ...payload.user,
        fullName: payload.user?.name ?? '',
        phone: payload.user?.phone ?? '',
      }
      persistUser(normalizedUser)
      const params = new URLSearchParams(window.location.search)
      navigate(params.get('redirect') || '/home')
    } catch (err) {
      if (!err?.status) {
        setError(t('login.errorNetwork'))
      } else if (err.status === 401) {
        setError(t('login.errorInvalidSimple'))
      } else {
        setError(err?.message || t('login.errorGeneric'))
      }
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
            <h1 className="authTitle">{t('login.title')}</h1>
            <p className="authSubtitle">{t('login.subtitle')}</p>
          </div>

          <form className="authForm" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="email" className="formLabel">
                {t('login.emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                className="formInput"
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="password" className="formLabel">
                {t('login.passwordLabel')}
              </label>
              <input
                type="password"
                id="password"
                className="formInput"
                placeholder={t('login.passwordPlaceholder')}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <Link to="/forgot-password" className="forgotLink">
                {t('login.forgotLink')}
              </Link>
            </div>

            {error ? <p className="authError">{error}</p> : null}

            <button type="submit" className="authBtn primary" disabled={isSubmitting}>
              {isSubmitting ? t('login.submitting') : t('login.submit')}
            </button>
          </form>

          <div className="authFooter">
            <span className="authFooterText">{t('login.footerText')}</span>
            <Link to="/signup" className="authLink">
              {t('login.footerLink')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Login
