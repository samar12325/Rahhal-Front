import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { apiRequest } from '../../api/client'
import AuthHeader from '../../components/AuthHeader/AuthHeader'
import Footer from '../Home/components/Footer'
import '../ForgotPassword/Auth.css'
import { useLanguage } from '../../i18n/LanguageContext'

function ResetPassword() {
  const { t, dir } = useLanguage()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!token) {
      setError(t('resetPassword.errorTokenMissing'))
      return
    }

    if (!password || !confirmPassword || password !== confirmPassword) {
      setError(t('resetPassword.errorMismatch'))
      return
    }

    try {
      setIsSubmitting(true)
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: { token, password },
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      if (!err?.status) {
        setError(t('resetPassword.errorNetwork'))
      } else {
        setError(err?.message || t('resetPassword.errorGeneric'))
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
            <h1 className="authTitle">{t('resetPassword.title')}</h1>
            <p className="authSubtitle">{t('resetPassword.subtitle')}</p>
          </div>

          <form className="authForm" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="password" className="formLabel">
                {t('resetPassword.passwordLabel')}
              </label>
              <input
                type="password"
                id="password"
                className="formInput"
                placeholder={t('resetPassword.passwordPlaceholder')}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
              />
            </div>

            <div className="formGroup">
              <label htmlFor="confirmPassword" className="formLabel">
                {t('resetPassword.confirmPasswordLabel')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="formInput"
                placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
              />
            </div>

            {error ? <p className="authError">{error}</p> : null}
            {success ? <p className="authSuccess">{t('resetPassword.success')}</p> : null}

            <button type="submit" className="authBtn primary" disabled={isSubmitting}>
              {isSubmitting ? t('resetPassword.submitting') : t('resetPassword.submit')}
            </button>
          </form>

          <div className="authFooter">
            <Link to="/login" className="authLink">
              {t('resetPassword.backLink')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ResetPassword
