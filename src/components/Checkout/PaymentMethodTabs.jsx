import { useLanguage } from '../../i18n/LanguageContext'

function PaymentMethodTabs({ value, onChange }) {
  const { t } = useLanguage()
  const methods = [
    {
      id: 'card',
      label: t('checkout.payment.methods.card.label'),
      hint: t('checkout.payment.methods.card.hint'),
    },
    {
      id: 'applePay',
      label: t('checkout.payment.methods.applePay.label'),
      hint: t('checkout.payment.methods.applePay.hint'),
    },
  ]

  return (
    <div className="paymentTabs" role="tablist" aria-label={t('checkout.payment.tabsLabel')}>
      {methods.map((method) => (
        <button
          key={method.id}
          type="button"
          role="tab"
          aria-selected={value === method.id}
          className={`paymentTab ${value === method.id ? 'active' : ''}`}
          onClick={() => onChange(method.id)}
        >
          <span className="paymentLabel">{method.label}</span>
          <span className="paymentHint">{method.hint}</span>
        </button>
      ))}
    </div>
  )
}

export default PaymentMethodTabs
