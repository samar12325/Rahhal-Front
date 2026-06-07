import DayPlanCard from './DayPlanCard'
import EmptyState from './EmptyState'
import LoadingState from './LoadingState'
import { useLanguage } from '../../i18n/LanguageContext'

function AiTripResult({ plan, loading, error, onRegenerate }) {
  const { t } = useLanguage()

  return (
    <section className="aiCard aiCardPad">
      <div className="aiResultHead">
        <div>
          <h2 className="aiFormTitle">{t('aiTrips.result.title')}</h2>
          <p className="resultSubtext">{t('aiTrips.result.subtitle')}</p>
        </div>
        {plan ? (
          <button className="secondaryBtn" type="button" onClick={onRegenerate}>
            {t('aiTrips.result.regenerate')}
          </button>
        ) : null}
      </div>

      {loading ? <LoadingState /> : null}
      {error ? <p className="aiError">{error}</p> : null}
      {!loading && !plan && !error ? <EmptyState /> : null}

      {plan ? (
        <div className="resultStack">
          <article className="planOverviewCard">
            <div className="planOverviewHead">
              <div>
                <p className="planEyebrow">{plan.city}</p>
                <h3 className="planHeroTitle">{plan.tripTitle || plan.city}</h3>
              </div>
              <span className="tag">{plan.styleLabel}</span>
            </div>
            <p className="planOverviewText">{plan.overview}</p>

            <div className="planMetrics">
              <div className="planMetric">
                <span>{t('aiTrips.result.metrics.days')}</span>
                <strong>{plan.days}</strong>
              </div>
              <div className="planMetric">
                <span>{t('aiTrips.result.metrics.budget')}</span>
                <strong>{plan.budgetLabel}</strong>
              </div>
              <div className="planMetric">
                <span>{t('aiTrips.result.metrics.total')}</span>
                <strong>
                  {plan.estimatedTotal} {t('aiTrips.currency')}
                </strong>
              </div>
              <div className="planMetric">
                <span>{t('aiTrips.result.metrics.audience')}</span>
                <strong>{plan.audienceLabel}</strong>
              </div>
            </div>

            {Array.isArray(plan.highlights) && plan.highlights.length > 0 ? (
              <div className="resultSection">
                <h4 className="resultSectionTitle">{t('aiTrips.result.highlights')}</h4>
                <div className="summaryTags">
                  {plan.highlights.map((item) => (
                    <span className="tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {Array.isArray(plan.tips) && plan.tips.length > 0 ? (
              <div className="resultSection">
                <h4 className="resultSectionTitle">{t('aiTrips.result.tips')}</h4>
                <div className="tipsList">
                  {plan.tips.map((item) => (
                    <div className="tipItem" key={item}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </article>

          <div className="daysStack">
            {plan.daysPlan.map((day) => (
              <DayPlanCard key={day.day} day={day} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default AiTripResult
