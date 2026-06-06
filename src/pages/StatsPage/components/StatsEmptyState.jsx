import { useLanguage } from '../../../i18n/LanguageContext'

function StatsEmptyState({ title, hint = '' }) {
  const { t } = useLanguage()
  const resolvedTitle = title || t('statsPage.empty.default')

  return (
    <div className="statsEmptyState" role="status" aria-live="polite">
      <p className="statsEmptyStateTitle">{resolvedTitle}</p>
      {hint ? <p className="statsEmptyStateHint">{hint}</p> : null}
    </div>
  )
}

export default StatsEmptyState
