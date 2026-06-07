import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { apiRequest } from '../../api/client'
import { buildLoginRedirectPath, isAuthenticated } from '../../auth/session'
import { useLanguage } from '../../i18n/LanguageContext'
import rahhalLogo from '../../assets/images/rahhal-logo.png'

const createEmptyForm = () => ({
  title: '',
  city: '',
  destination: '',
  date: '',
  maxParticipants: '',
  price: '',
  description: '',
  image: null,
  imageUrl: '',
  imageFileName: '',
})

function CreateGroupTripForm({ destinations = [], destinationsLoading = false, onCreated }) {
  const { t, language } = useLanguage()
  const [authNotice, setAuthNotice] = useState('')
  const [form, setForm] = useState(createEmptyForm)
  const [uploadedImagePreview, setUploadedImagePreview] = useState('')
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [fileInputKey, setFileInputKey] = useState(0)
  const uploadedImageUrlRef = useRef(null)
  const fileInputRef = useRef(null)
  const loginPath = buildLoginRedirectPath('/group-trips?tab=create')
  const needsLogin = !isAuthenticated()

  const releaseUploadedPreview = () => {
    if (uploadedImageUrlRef.current) {
      URL.revokeObjectURL(uploadedImageUrlRef.current)
      uploadedImageUrlRef.current = null
    }
  }

  useEffect(
    () => () => {
      if (uploadedImageUrlRef.current) {
        URL.revokeObjectURL(uploadedImageUrlRef.current)
        uploadedImageUrlRef.current = null
      }
    },
    [],
  )

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    if (submitError) {
      setSubmitError('')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] ?? null

    if (!file) {
      releaseUploadedPreview()
      setUploadedImagePreview('')
      setForm((prev) => ({ ...prev, image: null, imageFileName: '' }))
      return
    }

    if (!file.type.startsWith('image/')) {
      e.target.value = ''
      releaseUploadedPreview()
      setUploadedImagePreview('')
      setForm((prev) => ({ ...prev, image: null, imageFileName: '' }))
      setErrors((prev) => ({ ...prev, image: t('groupTrips.form.errors.imageType') }))
      return
    }

    const previewUrl = URL.createObjectURL(file)
    releaseUploadedPreview()
    uploadedImageUrlRef.current = previewUrl
    setUploadedImagePreview(previewUrl)
    setForm((prev) => ({
      ...prev,
      image: file,
      imageFileName: file.name,
    }))
    setErrors((prev) => ({ ...prev, image: '' }))
  }

  const resetFormState = () => {
    releaseUploadedPreview()
    setUploadedImagePreview('')
    setForm(createEmptyForm())
    setFileInputKey((prev) => prev + 1)
  }

  const currentImagePreview = uploadedImagePreview || form.imageUrl.trim() || rahhalLogo
  const dateInputLang = language === 'ar' ? 'ar-SA' : 'en-GB'
  const authRequiredMessage =
    language === 'ar'
      ? 'إنشاء الرحلات الجماعية يتطلب تسجيل الدخول أولاً.'
      : 'Creating group trips requires signing in first.'
  const authSessionExpiredMessage =
    language === 'ar'
      ? 'انتهت الجلسة أو لم يتم تسجيل الدخول. سجّل الدخول ثم أعد المحاولة.'
      : 'Your session expired or you are not signed in. Sign in and try again.'
  const authLoginAction = language === 'ar' ? 'تسجيل الدخول للمتابعة' : 'Sign in to continue'

  const buildPayload = () => {
    const formData = new FormData()
    formData.append('title', form.title.trim())
    formData.append('destination_id', form.city)
    formData.append('start_date', form.date)
    formData.append('end_date', form.date)
    formData.append('duration_days', '1')
    formData.append('required_participants', form.maxParticipants)
    formData.append('max_participants', form.maxParticipants)
    formData.append('notes', form.destination.trim())

    if (form.price !== '') {
      formData.append('price_per_person', form.price)
    }

    if (form.description.trim()) {
      formData.append('description', form.description.trim())
    }

    if (form.imageUrl.trim()) {
      formData.append('image_url', form.imageUrl.trim())
    }

    if (form.image) {
      formData.append('imageFile', form.image)
    }

    return formData
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (needsLogin) {
      setAuthNotice(authRequiredMessage)
      return
    }

    if (validate()) {
      setIsSubmitting(true)
      setSubmitError('')
      try {
        const created = await apiRequest('/api/group-trips', {
          method: 'POST',
          body: buildPayload(),
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        setSubmitted(true)
        onCreated?.(created)
        // Reset form after a delay
        setTimeout(() => {
          resetFormState()
          setSubmitted(false)
        }, 3000)
      } catch (error) {
        if (error?.status === 401) {
          setAuthNotice(authSessionExpiredMessage)
          return
        }

        setSubmitError(
          error?.message || t('groupTrips.form.errors.requestFailed', { fallback: 'تعذر إرسال الطلب' }),
        )
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleReset = () => {
    resetFormState()
    setErrors({})
    setSubmitted(false)
    setSubmitError('')
  }

  if (needsLogin || authNotice) {
    return (
      <section className="createTripForm">
        <h2 className="createTripFormTitle">{t('groupTrips.form.title')}</h2>
        <div className="createTripAuthGate">
          <p className="createTripAuthText">
            {authNotice || authRequiredMessage}
          </p>
          <div className="createTripAuthActions">
            <Link className="primaryBtn" to={loginPath}>
              {authLoginAction}
            </Link>
          </div>
        </div>
      </section>
    )
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
      {submitError && <div className="createTripFormError">{submitError}</div>}

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
              <option value="">
                {destinationsLoading
                  ? t('schoolTrips.form.placeholders.destinationLoading')
                  : t('groupTrips.form.placeholders.city')}
              </option>
              {destinations.map((destination) => {
                const regionLabel = destination.region
                  ? t(`regions.${destination.region}`)
                  : ''
                const label = regionLabel
                  ? `${destination.name} — ${regionLabel}`
                  : destination.name
                return (
                  <option key={destination.id} value={destination.id}>
                    {label}
                  </option>
                )
              })}
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
            <div className="createTripDateField">
              <input
                id="trip-date"
                className={`createTripDateInput ${form.date ? '' : 'is-empty'}`.trim()}
                type="date"
                lang={dateInputLang}
                dir="ltr"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              {!form.date ? (
                <span className="createTripDatePlaceholder">DD/MM/YYYY</span>
              ) : null}
            </div>
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

        <div className="createTripFormRow">
          <div className="createTripFormField">
            <label htmlFor="trip-image">{t('groupTrips.form.fields.image')}</label>
            <input
              key={fileInputKey}
              ref={fileInputRef}
              id="trip-image"
              className="createTripFileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="createTripFilePicker">
              <button
                type="button"
                className="secondaryBtn createTripFileButton"
                onClick={() => fileInputRef.current?.click()}
              >
                {t('groupTrips.form.fileAction', {
                  fallback: language === 'ar' ? 'اختيار صورة' : 'Choose image',
                })}
              </button>
              <span className="createTripFileName">
                {form.imageFileName ||
                  t('groupTrips.form.noFileSelected', {
                    fallback: language === 'ar' ? 'لم يتم اختيار ملف' : 'No file selected',
                  })}
              </span>
            </div>
            <div className="createTripFormFileMeta">
              {form.imageFileName
                ? t('groupTrips.form.selectedFile', {
                    params: { name: form.imageFileName },
                    fallback: `Selected file: ${form.imageFileName}`,
                  })
                : t('groupTrips.form.noFileSelected')}
            </div>
            {errors.image && <div className="createTripFormError">{errors.image}</div>}
          </div>

          <div className="createTripFormField">
            <label htmlFor="trip-image-url">{t('groupTrips.form.fields.imageUrl')}</label>
            <input
              id="trip-image-url"
              type="url"
              dir="ltr"
              value={form.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder={t('groupTrips.form.placeholders.imageUrl')}
            />
          </div>
        </div>

        <div className="createTripFormField">
          <div className="createTripFormHint">{t('groupTrips.form.imageHint')}</div>
          <div className="imagePreview">
            <div className="imagePreviewLabel">{t('groupTrips.form.imagePreviewLabel')}</div>
            <img src={currentImagePreview} alt={t('groupTrips.form.imagePreviewAlt')} />
          </div>
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

        <div className="createTripFormActions">
          <button type="submit" className="primaryBtn" disabled={isSubmitting}>
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
