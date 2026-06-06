import { useLanguage } from '../../i18n/LanguageContext'

function AiTripsTabs({ tab, setTab }) {
  const { t } = useLanguage()
  const tabs = [
    { id: 'plan', label: t('aiTrips.tabs.plan') },
    { id: 'chat', label: t('aiTrips.tabs.chat') },
  ]

  return (
    <div className="aiTabs">
      {tabs.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`tag ${tab === item.id ? 'active' : ''}`}
          onClick={() => setTab(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default AiTripsTabs
