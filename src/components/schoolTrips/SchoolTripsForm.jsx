import { useLanguage } from '../../i18n/LanguageContext'
import SchoolTripsParentApprovals from './SchoolTripsParentApprovals'
import { localizeSchoolTripName } from './schoolTripsLocale'

const gradeKeys = ['g4', 'g5', 'g6', 'm1', 'm2', 'm3', 'h1', 'h2', 'h3']
const getTodayDateValue = () => new Date().toISOString().slice(0, 10)

function SchoolTripsForm({
  form,
  setForm,
  onCreate,
  onReset,
  message,
  approvalTripId,
  onApprovalsChanged,
  permitKey,
  regions,
  cities,
  places,
  regionsLoading,
  citiesLoading,
  placesLoading,
  onRegionChange,
  onCityChange,
}) {
  const { t, language } = useLanguage()
  const minTripDate = getTodayDateValue()

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleBooleanChange = (field, value) => () => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const cityPlaceholder = !form.region
    ? language === 'ar'
      ? 'اختر المنطقة أولاً'
      : 'Select region first'
    : cities.length
      ? language === 'ar'
        ? 'اختر المدينة'
        : 'Select city'
      : language === 'ar'
        ? 'لا توجد مدن متاحة'
        : 'No cities available'

  const placePlaceholder = !form.destinationId
    ? language === 'ar'
      ? 'اختر المدينة أولاً'
      : 'Select city first'
    : places.length
      ? language === 'ar'
        ? 'اختر المكان أو المتحف'
        : 'Select place or museum'
      : language === 'ar'
        ? 'لا توجد أماكن متاحة'
        : 'No places available'

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    setForm((prev) => ({
      ...prev,
      permitFile: file || null,
      permitFileName: file ? file.name : '',
    }))
  }

  const busLabel = t('schoolTrips.form.fields.hasBus', {
    fallback: language === 'ar' ? 'هل تريد توفير باص؟' : 'Do you want to provide a bus?',
  })

  return (
    <section className="schoolCard schoolTripForm" id="create-trip">
      <div className="schoolCardHeader">
        <h2>{t('schoolTrips.form.title')}</h2>
        <p>{t('schoolTrips.form.subtitle')}</p>
      </div>

      <form className="schoolForm" onSubmit={(event) => event.preventDefault()}>
        <div className="schoolFormGrid">
          <div className="schoolField">
            <label htmlFor="trip-title">{t('schoolTrips.form.fields.title')}</label>
            <input
              id="trip-title"
              className="schoolInput"
              type="text"
              placeholder={t('schoolTrips.form.placeholders.title')}
              value={form.title}
              onChange={handleChange('title')}
            />
          </div>

          <div className="schoolField">
            <label htmlFor="trip-school">{t('schoolTrips.form.fields.schoolName')}</label>
            <input
              id="trip-school"
              className="schoolInput"
              type="text"
              placeholder={t('schoolTrips.form.placeholders.schoolName')}
              value={form.schoolName}
              onChange={handleChange('schoolName')}
            />
          </div>

          <div className="schoolField">
            <label htmlFor="trip-region">
              {t('schoolTrips.form.fields.region', {
                fallback: language === 'ar' ? 'المنطقة' : 'Region',
              })}
            </label>
            <select
              id="trip-region"
              className="schoolSelect"
              value={form.region}
              onChange={(event) => onRegionChange(event.target.value)}
              disabled={regionsLoading}
            >
              <option value="">
                {t('schoolTrips.form.placeholders.region', {
                  fallback: language === 'ar' ? 'اختر المنطقة' : 'Select region',
                })}
              </option>
              {regions.map((region) => (
                <option key={region.value} value={region.value}>
                  {t(`regions.${region.value}`, { fallback: region.label })}
                </option>
              ))}
            </select>
          </div>

          <div className="schoolField">
            <label htmlFor="trip-city">
              {t('schoolTrips.form.fields.city', {
                fallback: language === 'ar' ? 'المدينة' : 'City',
              })}
            </label>
            <select
              id="trip-city"
              className="schoolSelect"
              value={form.destinationId}
              onChange={(event) => onCityChange(event.target.value)}
              disabled={!form.region || citiesLoading}
            >
              <option value="">
                {citiesLoading ? t('schoolTrips.form.placeholders.destinationLoading') : cityPlaceholder}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {localizeSchoolTripName(language, city.name)}
                </option>
              ))}
            </select>
          </div>

          <div className="schoolField">
            <label htmlFor="trip-place">
              {t('schoolTrips.form.fields.place', {
                fallback: language === 'ar' ? 'المكان أو المتحف' : 'Place or museum',
              })}
            </label>
            <select
              id="trip-place"
              className="schoolSelect"
              value={form.placeId}
              onChange={handleChange('placeId')}
              disabled={!form.destinationId || placesLoading}
            >
              <option value="">
                {placesLoading ? t('schoolTrips.form.placeholders.destinationLoading') : placePlaceholder}
              </option>
              {places.map((place) => (
                <option key={place.id} value={place.id}>
                  {localizeSchoolTripName(language, place.name)}
                </option>
              ))}
            </select>
          </div>

          <div className="schoolField">
            <label htmlFor="trip-date">{t('schoolTrips.form.fields.date')}</label>
            <input
              id="trip-date"
              className="schoolInput"
              type="date"
              min={minTripDate}
              value={form.date}
              onChange={handleChange('date')}
            />
          </div>

          <div className="schoolField">
            <label htmlFor="trip-time">{t('schoolTrips.form.fields.time')}</label>
            <input
              id="trip-time"
              className="schoolInput"
              type="time"
              value={form.time}
              onChange={handleChange('time')}
            />
          </div>

          <div className="schoolField">
            <label htmlFor="trip-grade">{t('schoolTrips.form.fields.grade')}</label>
            <select
              id="trip-grade"
              className="schoolSelect"
              value={form.grade}
              onChange={handleChange('grade')}
            >
              <option value="">{t('schoolTrips.form.placeholders.grade')}</option>
              {gradeKeys.map((gradeKey) => (
                <option key={gradeKey} value={gradeKey}>
                  {t(`schoolTrips.grades.${gradeKey}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="schoolField">
            <span className="schoolTripsLabel">{busLabel}</span>
            <div className="schoolRadioGroup" role="radiogroup" aria-label={busLabel}>
              <label className="schoolRadioOption">
                <input
                  type="radio"
                  name="trip-has-bus"
                  checked={form.hasBus === true}
                  onChange={handleBooleanChange('hasBus', true)}
                />
                <span>{language === 'ar' ? 'نعم' : 'Yes'}</span>
              </label>
              <label className="schoolRadioOption">
                <input
                  type="radio"
                  name="trip-has-bus"
                  checked={form.hasBus === false}
                  onChange={handleBooleanChange('hasBus', false)}
                />
                <span>{language === 'ar' ? 'لا' : 'No'}</span>
              </label>
            </div>
          </div>

          <div className="schoolField">
            <label htmlFor="trip-students">{t('schoolTrips.form.fields.students')}</label>
            <input
              id="trip-students"
              className="schoolInput"
              type="number"
              min="0"
              placeholder={t('schoolTrips.form.placeholders.students')}
              value={form.studentsCount}
              onChange={handleChange('studentsCount')}
            />
          </div>

          <div className="schoolField">
            <label htmlFor="trip-supervisors">{t('schoolTrips.form.fields.supervisors')}</label>
            <input
              id="trip-supervisors"
              className="schoolInput"
              type="number"
              min="0"
              placeholder={t('schoolTrips.form.placeholders.supervisors')}
              value={form.supervisorsCount}
              onChange={handleChange('supervisorsCount')}
            />
          </div>

          <div className="schoolField">
            <label htmlFor="trip-meeting">{t('schoolTrips.form.fields.meetingPoint')}</label>
            <input
              id="trip-meeting"
              className="schoolInput"
              type="text"
              placeholder={t('schoolTrips.form.placeholders.meetingPoint')}
              value={form.meetingPoint}
              onChange={handleChange('meetingPoint')}
            />
          </div>

          <div className="schoolField">
            <label htmlFor="trip-permit">{t('schoolTrips.form.fields.permit')}</label>
            <input
              key={permitKey}
              id="trip-permit"
              className="schoolFileInput"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />
            {form.permitFileName ? (
              <span className="schoolFileName">
                {t('schoolTrips.form.fileAttached', {
                  params: { name: form.permitFileName },
                })}
              </span>
            ) : (
              <span className="schoolFileHint">{t('schoolTrips.form.fileHint')}</span>
            )}
          </div>
        </div>
      </form>

      <SchoolTripsParentApprovals
        tripId={approvalTripId}
        embedded
        onApprovalsChanged={onApprovalsChanged}
      />

      <div className="schoolFormActions">
        <button className="primaryBtn" type="button" onClick={onCreate}>
          {t('schoolTrips.form.actions.create')}
        </button>
        <button className="secondaryBtn" type="button" onClick={onReset}>
          {t('schoolTrips.form.actions.reset')}
        </button>
      </div>

      {message && <p className="schoolFormMessage">{message}</p>}
    </section>
  )
}

export default SchoolTripsForm
