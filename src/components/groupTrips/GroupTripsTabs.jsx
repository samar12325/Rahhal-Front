import { useLanguage } from '../../i18n/LanguageContext'

function GroupTripsTabs({ activeTab, setActiveTab }) {
  const { t } = useLanguage()
  const tabs = [
    { id: 'available', label: t('groupTrips.tabs.available') },
    { id: 'past', label: t('groupTrips.tabs.past') },
    { id: 'create', label: t('groupTrips.tabs.create') },
  ]

  return (
    <div className="groupTripsTabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`groupTripsTab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default GroupTripsTabs
