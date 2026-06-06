import { useMemo } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import PreferenceChips from './PreferenceChips'

const STYLE_KEYS = ['all', 'family', 'adventure', 'culture', 'relax', 'shopping']
const PREF_KEYS = ['nature', 'history', 'restaurants', 'events', 'sea', 'mountains', 'photography']

function AiTripForm({ form, setForm, onGenerate, onExample, loading }) {
  const { t } = useLanguage()

  const styleOptions = useMemo(
    () => STYLE_KEYS.map((key) => ({ value: key, label: t(`aiTrips.styles.${key}`) })),
    [t],
  )

  const prefOptions = useMemo(
    () => PREF_KEYS.map((key) => ({ value: key, label: t(`aiTrips.prefs.${key}`) })),
    [t],
  )

  return (
    <aside className="aiCard aiCardPad">
      <h2 className="aiFormTitle">{t('aiTrips.form.title')}</h2>

      <div className="field">
        <label htmlFor="ai-city">{t('aiTrips.form.cityLabel')}</label>
        <input
          id="ai-city"
          className="input"
          value={form.city}
          onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
          placeholder={t('aiTrips.form.cityPlaceholder')}
        />
      </div>

      <div className="twoCols">
        <div className="field">
          <label htmlFor="ai-days">{t('aiTrips.form.daysLabel')}</label>
          <input
            id="ai-days"
            className="input"
            type="number"
            min="1"
            max="14"
            value={form.days}
            onChange={(event) => setForm((prev) => ({ ...prev, days: Number(event.target.value) }))}
          />
        </div>
        <div className="field">
          <label htmlFor="ai-people">{t('aiTrips.form.peopleLabel')}</label>
          <input
            id="ai-people"
            className="input"
            type="number"
            min="1"
            max="20"
            value={form.people}
            onChange={(event) => setForm((prev) => ({ ...prev, people: Number(event.target.value) }))}
          />
        </div>
      </div>

      <div className="twoCols">
        <div className="field">
          <label htmlFor="ai-min">{t('aiTrips.form.minBudgetLabel')}</label>
          <input
            id="ai-min"
            className="input"
            inputMode="numeric"
            value={form.minBudget}
            onChange={(event) => setForm((prev) => ({ ...prev, minBudget: event.target.value }))}
            placeholder="0"
          />
        </div>
        <div className="field">
          <label htmlFor="ai-max">{t('aiTrips.form.maxBudgetLabel')}</label>
          <input
            id="ai-max"
            className="input"
            inputMode="numeric"
            value={form.maxBudget}
            onChange={(event) => setForm((prev) => ({ ...prev, maxBudget: event.target.value }))}
            placeholder="2000"
          />
        </div>
      </div>

      <div className="field" style={{ marginTop: 10 }}>
        <label>{t('aiTrips.form.styleLabel')}</label>
        <PreferenceChips
          options={styleOptions}
          selected={form.style}
          onChange={(value) => setForm((prev) => ({ ...prev, style: value }))}
        />
      </div>

      <div className="field" style={{ marginTop: 10 }}>
        <label>{t('aiTrips.form.prefsLabel')}</label>
        <PreferenceChips
          options={prefOptions}
          selected={form.prefs}
          onChange={(value) => setForm((prev) => ({ ...prev, prefs: value }))}
          multi
        />
      </div>

      <div className="field" style={{ marginTop: 10 }}>
        <label htmlFor="ai-notes">{t('aiTrips.form.notesLabel')}</label>
        <textarea
          id="ai-notes"
          className="textarea"
          rows="3"
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          placeholder={t('aiTrips.form.notesPlaceholder')}
        />
      </div>

      <div className="aiActions">
        <button className="primaryBtn" type="button" onClick={onGenerate} disabled={loading}>
          {loading ? t('aiTrips.form.generating') : t('aiTrips.form.generate')}
        </button>
        <button className="secondaryBtn" type="button" onClick={onExample} disabled={loading}>
          {t('aiTrips.form.example')}
        </button>
      </div>
    </aside>
  )
}

export default AiTripForm
