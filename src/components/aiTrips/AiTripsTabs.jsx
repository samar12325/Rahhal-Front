import { useLanguage } from '../../i18n/LanguageContext'

function AiTripsTabs({ mode, setMode }) {
  const { t } = useLanguage()
  const tabs = [
    { id: 'assistant', label: t('aiTrips.tabs.assistant') },
    { id: 'planner', label: t('aiTrips.tabs.planner') },
  ]

  return (
    <div className="aiTabs">
      {tabs.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`tag ${mode === item.id ? 'active' : ''}`}
          onClick={() => setMode(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default AiTripsTabs
