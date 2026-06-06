import DayPlanCard from './DayPlanCard'
import EmptyState from './EmptyState'
import LoadingState from './LoadingState'
import { useLanguage } from '../../i18n/LanguageContext'

function AiTripResult({ plan, loading, error, onRegenerate, onSave, onShare }) {
  const { t } = useLanguage()

  return (
    <section className="aiCard aiCardPad">
      <div className="aiResultHead">
        <h2 className="aiFormTitle">{t('aiTrips.result.title')}</h2>
        {plan && (
          <button className="secondaryBtn" type="button" onClick={onRegenerate}>
            {t('aiTrips.result.regenerate')}
          </button>
        )}
      </div>

      {loading && <LoadingState />}

      {error && <p className="aiError">{error}</p>}

      {!loading && !plan && !error && <EmptyState />}

      {plan && (
        <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
          <div className="summaryTags">
            <span className="tag">{plan.city}</span>
            <span className="tag">
              {t('aiTrips.summary.days', { params: { count: plan.days } })}
            </span>
            <span className="tag">
              {t('aiTrips.summary.budget', { params: { label: plan.budgetLabel } })}
            </span>
          </div>

          {plan.daysPlan.map((day) => (
            <DayPlanCard key={day.day} day={day} />
          ))}

          <div className="aiResultActions">
            <button className="primaryBtn" type="button" onClick={onSave}>
              {t('aiTrips.result.save')}
            </button>
            <button className="secondaryBtn" type="button" onClick={onShare}>
              {t('aiTrips.result.share')}
            </button>
            <button className="secondaryBtn" type="button" onClick={onRegenerate}>
              {t('aiTrips.result.regenerate')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default AiTripResult
