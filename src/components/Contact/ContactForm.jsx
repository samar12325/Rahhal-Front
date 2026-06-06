import { useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import './ContactForm.css'

const getInitialState = () => ({
  name: '',
  email: '',
  type: 'inquiry',
  message: '',
})

function ContactForm() {
  const { t } = useLanguage()
  const [formValues, setFormValues] = useState(getInitialState)
  const [isSuccess, setIsSuccess] = useState(false)

  const typeOptions = [
    { value: 'suggestion', label: t('contact.form.types.suggestion') },
    { value: 'complaint', label: t('contact.form.types.complaint') },
    { value: 'inquiry', label: t('contact.form.types.inquiry') },
    { value: 'partnership', label: t('contact.form.types.partnership') },
  ]

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }))
    setIsSuccess(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsSuccess(true)
    setFormValues(getInitialState())
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
          placeholder={t('contact.form.messagePlaceholder')}
        />
      </div>

      <button className="contactSubmit" type="submit">
        {t('contact.form.submit')}
      </button>

      {isSuccess ? <p className="contactSuccess">{t('contact.form.success')}</p> : null}
    </form>
  )
}

export default ContactForm
