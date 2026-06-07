import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../../api/client'
import { persistUser } from '../../auth/session'
import AuthHeader from '../../components/AuthHeader/AuthHeader'
import Footer from '../Home/components/Footer'
import './Auth.css'
import { useLanguage } from '../../i18n/LanguageContext'

function Signup() {
  const { t, dir } = useLanguage()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('signup.errorPasswordMismatch'))
      return
    }

    try {
      setIsSubmitting(true)
      const payload = await apiRequest('/auth/register', {
        method: 'POST',
        body: {
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        },
      })

      const normalizedUser = {
        ...payload.user,
        fullName: payload.user?.name ?? fullName.trim(),
        phone: payload.user?.phone ?? '',
      }
      persistUser(normalizedUser)
      navigate('/home')
    } catch (err) {
      if (!err?.status) {
        setError(t('signup.errorNetwork'))
      } else if (
        err.status === 400 &&
        typeof err?.message === 'string' &&
        err.message.toLowerCase().includes('email already exists')
      ) {
        setError(t('signup.errorEmailExists'))
      } else {
        setError(err?.message || t('signup.errorGeneric'))
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
            <h1 className="authTitle">{t('signup.title')}</h1>
            <p className="authSubtitle">{t('signup.subtitle')}</p>
          </div>

          <form className="authForm" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="fullName" className="formLabel">
                {t('signup.fullNameLabel')}
              </label>
              <input
                type="text"
                id="fullName"
                className="formInput"
                placeholder={t('signup.fullNamePlaceholder')}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="email" className="formLabel">
                {t('signup.emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                className="formInput"
                placeholder={t('signup.emailPlaceholder')}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="password" className="formLabel">
                {t('signup.passwordLabel')}
              </label>
              <input
                type="password"
                id="password"
                className="formInput"
                placeholder={t('signup.passwordPlaceholder')}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="confirmPassword" className="formLabel">
                {t('signup.confirmPasswordLabel')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="formInput"
                placeholder={t('signup.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                required
              />
            </div>

            {error ? <p className="authError">{error}</p> : null}

            <button type="submit" className="authBtn primary" disabled={isSubmitting}>
              {isSubmitting ? t('signup.submitting') : t('signup.submit')}
            </button>
          </form>

          <div className="authFooter">
            <span className="authFooterText">{t('signup.footerText')}</span>
            <Link to="/login" className="authLink">
              {t('signup.footerLink')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Signup
