import { useState } from 'react'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'
import './ContactForm.css'

const getInitialState = () => ({
  name: '',
  email: '',
  type: 'inquiry',
  message: '',
})

const normalizePayload = (values) => ({
  name: values.name.trim(),
  email: values.email.trim().toLowerCase(),
  type: values.type,
  message: values.message.trim(),
})

function ContactForm() {
  const { t } = useLanguage()
  const [formValues, setFormValues] = useState(getInitialState)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const typeOptions = [
    { value: 'suggestion', label: t('contact.form.types.suggestion') },
    { value: 'complaint', label: t('contact.form.types.complaint') },
    { value: 'inquiry', label: t('contact.form.types.inquiry') },
    { value: 'partnership', label: t('contact.form.types.partnership') },
  ]

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }))
    setIsSuccess(false)
    setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setIsSuccess(false)
    setErrorMessage('')

    try {
      const payload = normalizePayload(formValues)

      if (!payload.name || !payload.email || !payload.message || payload.message.length < 6) {
        setErrorMessage(t('contact.form.validation'))
        return
      }

      const response = await apiRequest('/contact', {
        method: 'POST',
        body: payload,
      })

      if (!response?.ok) {
        setErrorMessage(t('contact.form.error'))
        setIsSuccess(false)
        return
      }

      setIsSuccess(true)
      setFormValues(getInitialState())
    } catch (error) {
      const message = error?.message || t('contact.form.error')
      setErrorMessage(message)
      setIsSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="contactForm" onSubmit={handleSubmit}>
      <div className="formField">
        <label htmlFor="contact-name">{t('contact.form.nameLabel')}</label>
        <input
          id="contact-name"
          type="text"
          className="formInput"
          value={formValues.name}
          onChange={handleChange('name')}
          required
          placeholder={t('contact.form.namePlaceholder')}
        />
      </div>

      <div className="formField">
        <label htmlFor="contact-email">{t('contact.form.emailLabel')}</label>
        <input
          id="contact-email"
          type="email"
          className="formInput"
          value={formValues.email}
          onChange={handleChange('email')}
          required
          placeholder={t('contact.form.emailPlaceholder')}
        />
      </div>

      <div className="formField">
        <label htmlFor="contact-type">{t('contact.form.typeLabel')}</label>
        <select
          id="contact-type"
          className="formInput"
          value={formValues.type}
          onChange={handleChange('type')}
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="formField">
        <label htmlFor="contact-message">{t('contact.form.messageLabel')}</label>
        <textarea
          id="contact-message"
          className="formInput"
          rows="5"
          value={formValues.message}
          onChange={handleChange('message')}
          required
          minLength={6}
          maxLength={2000}
          placeholder={t('contact.form.messagePlaceholder')}
        />
      </div>

      <button className="contactSubmit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
      </button>

      {errorMessage ? <p className="contactError">{errorMessage}</p> : null}
      {isSuccess ? <p className="contactSuccess">{t('contact.form.success')}</p> : null}
    </form>
  )
}

export default ContactForm
