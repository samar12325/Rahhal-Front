import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import destinations from '../../data/destinations'
import { loadTrips } from '../../data/trips.store'
import PaymentMethodTabs from '../../components/Checkout/PaymentMethodTabs'
import CardPaymentForm from '../../components/Checkout/CardPaymentForm'
import ApplePayPanel from '../../components/Checkout/ApplePayPanel'
import OrderSummary from '../../components/Checkout/OrderSummary'
import './Checkout.css'
import { useLanguage } from '../../i18n/LanguageContext'
import { apiRequest } from '../../api/client'
import { buildLoginRedirectPath, isAuthenticated } from '../../auth/session'
import { checkoutBooking } from '../../services/bookings'

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
  const navigate = useNavigate()
  const search = searchParams.toString()
  const destinationId = searchParams.get('destinationId')
  const activityId = searchParams.get('activityId')
  const tripId = searchParams.get('tripId')
  const tripDate = searchParams.get('date')
  const tripTime = searchParams.get('time')
  const tripPeople = searchParams.get('people')

  const destination = destinations.find((item) => item.id === destinationId)
  const activity = destination?.activities.find((item) => item.id === activityId)
  const localTrip = useMemo(
    () => trips.find((item) => String(item.id) === String(tripId)),
    [trips, tripId]
  )
  const [apiTrip, setApiTrip] = useState(null)
  const selectedTrip = localTrip || apiTrip

  useEffect(() => {
    let isMounted = true

    if (!tripId || localTrip || !/^\d+$/.test(String(tripId))) {
      setApiTrip(null)
      return () => {
        isMounted = false
      }
    }

    const loadTrip = async () => {
      try {
        const payload = await apiRequest(`/api/trips/${tripId}`)
        if (!isMounted) return
        setApiTrip({
          id: payload.id,
          destinationId: payload.destination_id,
          activityId: null,
          title: payload.title,
          city: payload.destination?.name || '',
          price: Number(payload.price_per_person || 0),
          image: payload.image_url || payload.destination?.image_url || '',
        })
      } catch {
        if (isMounted) setApiTrip(null)
      }
    }

    loadTrip()

    return () => {
      isMounted = false
    }
  }, [localTrip, tripId])

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [formValues, setFormValues] = useState(initialFormValues)
  const [formErrors, setFormErrors] = useState({})
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) return

    const checkoutPath = search ? `/checkout?${search}` : '/checkout'
    navigate(buildLoginRedirectPath(checkoutPath), { replace: true })
  }, [navigate, search])

  const bookingDetails = useMemo(
    () => ({
      date: tripDate || '',
      time: tripTime || '',
      people: tripPeople || '',
    }),
    [tripDate, tripTime, tripPeople]
  )

  const pricing = useMemo(() => {
    const basePrice = selectedTrip?.price ?? activity?.priceFrom ?? 0
    const tax = basePrice ? Math.round(basePrice * VAT_RATE) : 0
    const total = basePrice ? basePrice + tax : 0
    return { basePrice, tax, total }
  }, [activity, selectedTrip])

  const hasProduct = Boolean((destination && activity) || selectedTrip)

  const handleMethodChange = (method) => {
    setPaymentMethod(method)
    setFormErrors({})
    setIsSuccess(false)
    setSubmitError('')
  }

  const handleFieldChange = (field, value) => {
    setIsSuccess(false)
    setSubmitError('')
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

  const handleSubmit = async (event) => {
    event?.preventDefault()

    if (!hasProduct) return

    if (paymentMethod === 'card') {
      const errors = validateCardForm()
      setFormErrors(errors)
      if (Object.keys(errors).length > 0) return
    }

    if (!tripId || !destinationId || !tripDate || !tripTime || !tripPeople) {
      setSubmitError('بيانات الحجز غير مكتملة.')
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')
      const normalizedMethod = paymentMethod === 'applePay' ? 'applepay' : 'card'

      await checkoutBooking({
        tripId,
        destinationId,
        date: tripDate,
        time: tripTime,
        people: tripPeople,
        paymentMethod: normalizedMethod,
        amount: pricing.total,
      })

      setIsSuccess(true)
      navigate('/booking-success')
    } catch (error) {
      setSubmitError(error?.message || 'تعذر إكمال الدفع حالياً.')
    } finally {
      setIsSubmitting(false)
    }
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
                <button className="payButton" type="submit" disabled={!hasProduct || isSubmitting}>
                  {t('checkout.actions.pay')}
                </button>
                <p className="checkoutNote">{t('checkout.actions.note')}</p>
                {submitError ? <p className="bookingError">{submitError}</p> : null}
              </div>
            </form>
          </div>

          <div className="checkoutCard summaryCard">
            <OrderSummary
              destination={destination}
              activity={activity}
              pricing={pricing}
              trip={selectedTrip}
              bookingDetails={bookingDetails}
            />
            <Link
              className="backLink"
              to={destination ? `/destinations/${destination.id}` : '/home'}
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
