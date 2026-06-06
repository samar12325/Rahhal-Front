import { useLanguage } from '../../i18n/LanguageContext'

function formatDate(value, language) {
  if (!value) return ''

  try {
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-SA', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return value
  }
}

function AiTripHistory({
  sessions,
  loading,
  error,
  authRequired,
  selectedId,
  onSelect,
  mode = 'planner',
  title,
  subtitle,
  emptyLabel,
}) {
  const { t, language } = useLanguage()

  return (
    <section className="aiCard aiCardPad">
      <div className="historyHead">
        <div>
          <h2 className="aiFormTitle">{title || t('aiTrips.history.title')}</h2>
          <p className="historyText">{subtitle || t('aiTrips.history.subtitle')}</p>
        </div>
      </div>

      {loading ? <p className="aiResultLoading">{t('aiTrips.history.loading')}</p> : null}
      {!loading && error ? <p className="aiError">{error}</p> : null}
      {!loading && !error && authRequired ? (
        <p className="historyText">{t('aiTrips.history.authRequired')}</p>
      ) : null}
      {!loading && !error && !authRequired && sessions.length === 0 ? (
        <p className="historyText">{emptyLabel || t('aiTrips.history.empty')}</p>
      ) : null}

      {!loading && !error && !authRequired && sessions.length > 0 ? (
        <div className="historyList">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              className={`historyItem ${selectedId === session.id ? 'active' : ''}`}
              onClick={() => onSelect(session.id)}
            >
              <div className="historyItemTop">
                <strong>{session.title}</strong>
                <span className="tag">
                  {mode === 'planner'
                    ? t('aiTrips.summary.days', { params: { count: session.days } })
                    : t('aiTrips.assistant.historyChip')}
                </span>
              </div>
              <div className="historyMeta">
                <span>{session.city}</span>
                <span>{formatDate(session.lastMessageAt || session.updatedAt, language)}</span>
              </div>
              <p className="historyPreview">
                {session.lastMessagePreview || t('aiTrips.history.noMessages')}
              </p>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default AiTripHistory
