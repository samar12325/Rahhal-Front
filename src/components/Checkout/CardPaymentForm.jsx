import { useLanguage } from '../../i18n/LanguageContext'

function CardPaymentForm({ values, errors, onChange }) {
  const { t } = useLanguage()
  const handleChange = (field) => (event) => {
    onChange(field, event.target.value)
  }

  return (
    <div className="cardForm">
      <div className="formField full">
        <label htmlFor="card-name">{t('checkout.form.nameLabel')}</label>
        <input
          id="card-name"
          type="text"
          value={values.name}
          onChange={handleChange('name')}
          placeholder={t('checkout.form.namePlaceholder')}
          autoComplete="cc-name"
          className="formInput"
        />
        {errors.name ? <span className="fieldError">{errors.name}</span> : null}
      </div>

      <div className="formField full">
        <label htmlFor="card-number">{t('checkout.form.numberLabel')}</label>
        <input
          id="card-number"
          type="text"
          inputMode="numeric"
          value={values.number}
          onChange={handleChange('number')}
          placeholder={t('checkout.form.numberPlaceholder')}
          autoComplete="cc-number"
          className="formInput"
          maxLength={19}
        />
        {errors.number ? <span className="fieldError">{errors.number}</span> : null}
      </div>

      <div className="formField">
        <label htmlFor="card-expiry">{t('checkout.form.expiryLabel')}</label>
        <input
          id="card-expiry"
          type="text"
          inputMode="numeric"
          value={values.expiry}
          onChange={handleChange('expiry')}
          placeholder={t('checkout.form.expiryPlaceholder')}
          autoComplete="cc-exp"
          className="formInput"
          maxLength={5}
        />
        {errors.expiry ? <span className="fieldError">{errors.expiry}</span> : null}
      </div>

      <div className="formField">
        <label htmlFor="card-cvc">{t('checkout.form.cvcLabel')}</label>
        <input
          id="card-cvc"
          type="text"
          inputMode="numeric"
          value={values.cvc}
          onChange={handleChange('cvc')}
          placeholder={t('checkout.form.cvcPlaceholder')}
          autoComplete="cc-csc"
          className="formInput"
          maxLength={4}
        />
        {errors.cvc ? <span className="fieldError">{errors.cvc}</span> : null}
      </div>
    </div>
  )
}

export default CardPaymentForm
