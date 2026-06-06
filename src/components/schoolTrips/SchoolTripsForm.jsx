import { useLanguage } from '../../i18n/LanguageContext'

const gradeKeys = ['g4', 'g5', 'g6', 'm1', 'm2', 'm3', 'h1', 'h2', 'h3']
const transportKeys = ['schoolBuses', 'privateBuses', 'noTransport']

function SchoolTripsForm({ form, setForm, onCreate, onReset, message, permitKey }) {
  const { t } = useLanguage()
  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    setForm((prev) => ({
      ...prev,
      permitFile: file || null,
      permitFileName: file ? file.name : '',
    }))
  }

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
            <label htmlFor="trip-destination">{t('schoolTrips.form.fields.destination')}</label>
            <input
              id="trip-destination"
              className="schoolInput"
              type="text"
              placeholder={t('schoolTrips.form.placeholders.destination')}
              value={form.destination}
              onChange={handleChange('destination')}
            />
          </div>

          <div className="schoolField">
            <label htmlFor="trip-date">{t('schoolTrips.form.fields.date')}</label>
            <input
              id="trip-date"
              className="schoolInput"
              type="date"
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
            <label htmlFor="trip-transport">{t('schoolTrips.form.fields.transport')}</label>
            <select
              id="trip-transport"
              className="schoolSelect"
              value={form.transport}
              onChange={handleChange('transport')}
            >
              <option value="">{t('schoolTrips.form.placeholders.transport')}</option>
              {transportKeys.map((transportKey) => (
                <option key={transportKey} value={transportKey}>
                  {t(`schoolTrips.transports.${transportKey}`)}
                </option>
              ))}
            </select>
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
            <label htmlFor="trip-focus">{t('schoolTrips.form.fields.focus')}</label>
            <input
              id="trip-focus"
              className="schoolInput"
              type="text"
              placeholder={t('schoolTrips.form.placeholders.focus')}
              value={form.focus}
              onChange={handleChange('focus')}
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

        <div className="schoolField">
          <label htmlFor="trip-agenda">{t('schoolTrips.form.fields.agenda')}</label>
          <textarea
            id="trip-agenda"
            className="schoolTextarea"
            placeholder={t('schoolTrips.form.placeholders.agenda')}
            value={form.agenda}
            onChange={handleChange('agenda')}
          />
        </div>

        <div className="schoolField">
          <label htmlFor="trip-notes">{t('schoolTrips.form.fields.notes')}</label>
          <textarea
            id="trip-notes"
            className="schoolTextarea"
            placeholder={t('schoolTrips.form.placeholders.notes')}
            value={form.notes}
            onChange={handleChange('notes')}
          />
        </div>
      </form>

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
