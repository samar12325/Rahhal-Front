import { useLanguage } from '../../i18n/LanguageContext'

function ApplePayPanel({ onApplePay }) {
  const { t } = useLanguage()
  return (
    <div className="applePayPanel">
      <button type="button" className="applePayButton" onClick={onApplePay}>
        Apple Pay
      </button>
      <p className="applePayNote">
        {t('checkout.payment.applePayNote')}
      </p>
    </div>
  )
}

export default ApplePayPanel
