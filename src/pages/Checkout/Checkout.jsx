import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import destinations from '../../data/destinations'
import offers from '../../data/offers'
import { loadTrips } from '../../data/trips.store'
import PaymentMethodTabs from '../../components/Checkout/PaymentMethodTabs'
import CardPaymentForm from '../../components/Checkout/CardPaymentForm'
import ApplePayPanel from '../../components/Checkout/ApplePayPanel'
import OrderSummary from '../../components/Checkout/OrderSummary'
import './Checkout.css'
import { useLanguage } from '../../i18n/LanguageContext'

const VAT_RATE = 0.15

const initialFormValues = {
  name: '',
  number: '',
  expiry: '',
  cvc: '',
}

function Checkout() {
  const { t, dir } = useLanguage()
  const [trips] = useState(() => loadTrips())
  const [searchParams] = useSearchParams()
  const destinationId = searchParams.get('destinationId')
  const activityId = searchParams.get('activityId')
  const offerId = searchParams.get('offerId')
  const tripId = searchParams.get('tripId')
  const tripDate = searchParams.get('date')
  const tripTime = searchParams.get('time')
  const tripPeople = searchParams.get('people')

  const destination = destinations.find((item) => item.id === destinationId)
  const activity = destination?.activities.find((item) => item.id === activityId)
  const offer = offers.find((item) => item.id === offerId)
  const selectedTrip = useMemo(() => trips.find((item) => item.id === tripId), [trips, tripId])

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [formValues, setFormValues] = useState(initialFormValues)
  const [formErrors, setFormErrors] = useState({})
  const [isSuccess, setIsSuccess] = useState(false)

  const bookingDetails = useMemo(
    () => ({
      date: tripDate || '',
      time: tripTime || '',
      people: tripPeople || '',
    }),
    [tripDate, tripTime, tripPeople]
  )

  const pricing = useMemo(() => {
    const basePrice = selectedTrip?.price ?? offer?.newPrice ?? activity?.priceFrom ?? 0
    const tax = basePrice ? Math.round(basePrice * VAT_RATE) : 0
    const total = basePrice ? basePrice + tax : 0
    return { basePrice, tax, total }
  }, [activity, offer, selectedTrip])

  const hasProduct = Boolean(offer || (destination && activity) || selectedTrip)

  const handleMethodChange = (method) => {
    setPaymentMethod(method)
    setFormErrors({})
    setIsSuccess(false)
  }

  const handleFieldChange = (field, value) => {
    setIsSuccess(false)
    setFormErrors((prev) => ({ ...prev, [field]: '' }))

    if (field === 'number') {
      const digits = value.replace(/\D/g, '').slice(0, 16)
      const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
      setFormValues((prev) => ({ ...prev, number: formatted }))
      return
    }

    if (field === 'expiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4)
      const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
      setFormValues((prev) => ({ ...prev, expiry: formatted }))
      return
    }

    if (field === 'cvc') {
      const digits = value.replace(/\D/g, '').slice(0, 4)
      setFormValues((prev) => ({ ...prev, cvc: digits }))
      return
    }

    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  const validateCardForm = () => {
    const errors = {}
    const numberDigits = formValues.number.replace(/\D/g, '')

    if (!formValues.name.trim()) {
      errors.name = t('checkout.validation.name')
    }

    if (numberDigits.length !== 16) {
      errors.number = t('checkout.validation.number')
    }

    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(formValues.expiry)) {
      errors.expiry = t('checkout.validation.expiry')
    }

    if (!/^\d{3,4}$/.test(formValues.cvc)) {
      errors.cvc = t('checkout.validation.cvc')
    }

    return errors
  }

  const handleSubmit = (event) => {
    event?.preventDefault()

    if (!hasProduct) return

    if (paymentMethod === 'card') {
      const errors = validateCardForm()
      setFormErrors(errors)
      if (Object.keys(errors).length > 0) return
    }

    setIsSuccess(true)
  }

  return (
    <div className="checkoutPage" dir={dir}>
      <div className="container">
        <header className="checkoutHeader">
          <p className="checkoutEyebrow">{t('checkout.hero.eyebrow')}</p>
          <h1>{t('checkout.hero.title')}</h1>
          <p className="checkoutSubtitle">{t('checkout.hero.subtitle')}</p>
        </header>

        {isSuccess ? (
          <div className="checkoutSuccess" role="status">
            <h2>{t('checkout.success.title')}</h2>
            <p>{t('checkout.success.subtitle')}</p>
          </div>
        ) : null}

        <div className="checkoutGrid">
          <div className="checkoutCard">
            <form className="checkoutForm" onSubmit={handleSubmit}>
              <PaymentMethodTabs value={paymentMethod} onChange={handleMethodChange} />

              {paymentMethod === 'card' ? (
                <CardPaymentForm
                  values={formValues}
                  errors={formErrors}
                  onChange={handleFieldChange}
                />
              ) : (
                <ApplePayPanel onApplePay={handleSubmit} />
              )}

              <div className="checkoutActions">
                <button className="payButton" type="submit" disabled={!hasProduct}>
                  {t('checkout.actions.pay')}
                </button>
                <p className="checkoutNote">{t('checkout.actions.note')}</p>
              </div>
            </form>
          </div>

          <div className="checkoutCard summaryCard">
            <OrderSummary
              destination={destination}
              activity={activity}
              offer={offer}
              pricing={pricing}
              trip={selectedTrip}
              bookingDetails={bookingDetails}
            />
            <Link
              className="backLink"
              to={offer ? '/events' : destination ? `/destinations/${destination.id}` : '/home'}
            >
              {t('checkout.back')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
