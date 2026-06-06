import { useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'

const CITY_KEYS = [
  'riyadh',
  'jeddah',
  'dammam',
  'khobar',
  'madinah',
  'mecca',
  'taif',
  'abha',
  'alula',
  'najran',
  'tabuk',
  'hail',
]

function CreateGroupTripForm() {
  const { t } = useLanguage()
  const [form, setForm] = useState({
    title: '',
    city: '',
    destination: '',
    date: '',
    maxParticipants: '',
    price: '',
    description: '',
    image: null,
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: t('groupTrips.form.errors.imageType') }))
        return
      }
      setForm((prev) => ({ ...prev, image: file }))
      setErrors((prev) => ({ ...prev, image: '' }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!form.title.trim()) {
      newErrors.title = t('groupTrips.form.errors.titleRequired')
    }

    if (!form.city) {
      newErrors.city = t('groupTrips.form.errors.cityRequired')
    }

    if (!form.destination.trim()) {
      newErrors.destination = t('groupTrips.form.errors.destinationRequired')
    }

    if (!form.date) {
      newErrors.date = t('groupTrips.form.errors.dateRequired')
    }

    if (!form.maxParticipants || Number(form.maxParticipants) < 2) {
      newErrors.maxParticipants = t('groupTrips.form.errors.minParticipants')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      // Here you would typically send the form data to a backend
      console.log('Form submitted:', form)
      setSubmitted(true)
      // Reset form after a delay
      setTimeout(() => {
        setForm({
          title: '',
          city: '',
          destination: '',
          date: '',
          maxParticipants: '',
          price: '',
          description: '',
          image: null,
        })
        setImagePreview(null)
        setSubmitted(false)
      }, 3000)
    }
  }

  const handleReset = () => {
    setForm({
      title: '',
      city: '',
      destination: '',
      date: '',
      maxParticipants: '',
      price: '',
      description: '',
      image: null,
    })
    setImagePreview(null)
    setErrors({})
    setSubmitted(false)
  }

  return (
    <section className="createTripForm">
      <h2 className="createTripFormTitle">{t('groupTrips.form.title')}</h2>

      {submitted && (
        <div
          style={{
            padding: '12px',
            background: '#fffaf2',
            border: '1px solid var(--accent)',
            borderRadius: '14px',
            color: 'var(--ink)',
          }}
        >
          {t('groupTrips.form.success')}
        </div>
      )}

      <form onSubmit={handleSubmit} className="createTripFormFields">
        <div className="createTripFormField">
          <label htmlFor="trip-title">{t('groupTrips.form.fields.title')}</label>
          <input
            id="trip-title"
            type="text"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder={t('groupTrips.form.placeholders.title')}
          />
          {errors.title && <div className="createTripFormError">{errors.title}</div>}
        </div>

        <div className="createTripFormRow">
          <div className="createTripFormField">
            <label htmlFor="trip-city">{t('groupTrips.form.fields.city')}</label>
            <select
              id="trip-city"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
            >
              <option value="">{t('groupTrips.form.placeholders.city')}</option>
              {CITY_KEYS.map((cityKey) => (
                <option key={cityKey} value={cityKey}>
                  {t(`groupTrips.cities.${cityKey}`)}
                </option>
              ))}
            </select>
            {errors.city && <div className="createTripFormError">{errors.city}</div>}
          </div>

          <div className="createTripFormField">
            <label htmlFor="trip-destination">{t('groupTrips.form.fields.destination')}</label>
            <input
              id="trip-destination"
              type="text"
              value={form.destination}
              onChange={(e) => handleChange('destination', e.target.value)}
              placeholder={t('groupTrips.form.placeholders.destination')}
            />
            {errors.destination && <div className="createTripFormError">{errors.destination}</div>}
          </div>
        </div>

        <div className="createTripFormRow">
          <div className="createTripFormField">
            <label htmlFor="trip-date">{t('groupTrips.form.fields.date')}</label>
            <input
              id="trip-date"
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <div className="createTripFormError">{errors.date}</div>}
          </div>

          <div className="createTripFormField">
            <label htmlFor="trip-participants">
              {t('groupTrips.form.fields.maxParticipants')}
            </label>
            <input
              id="trip-participants"
              type="number"
              min="2"
              max="50"
              value={form.maxParticipants}
              onChange={(e) => handleChange('maxParticipants', e.target.value)}
              placeholder={t('groupTrips.form.placeholders.maxParticipants')}
            />
            {errors.maxParticipants && <div className="createTripFormError">{errors.maxParticipants}</div>}
          </div>
        </div>

        <div className="createTripFormField">
          <label htmlFor="trip-price">{t('groupTrips.form.fields.price')}</label>
          <input
            id="trip-price"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder={t('groupTrips.form.placeholders.price')}
          />
        </div>

        <div className="createTripFormField">
          <label htmlFor="trip-description">{t('groupTrips.form.fields.description')}</label>
          <textarea
            id="trip-description"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder={t('groupTrips.form.placeholders.description')}
          />
        </div>

        <div className="createTripFormField">
          <label htmlFor="trip-image">{t('groupTrips.form.fields.image')}</label>
          <input
            id="trip-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {errors.image && <div className="createTripFormError">{errors.image}</div>}
          {imagePreview && (
            <div className="imagePreview">
              <img src={imagePreview} alt={t('groupTrips.form.imagePreviewAlt')} />
            </div>
          )}
        </div>

        <div className="createTripFormActions">
          <button type="submit" className="primaryBtn">
            {t('groupTrips.form.actions.create')}
          </button>
          <button type="button" className="secondaryBtn" onClick={handleReset}>
            {t('groupTrips.form.actions.cancel')}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreateGroupTripForm
