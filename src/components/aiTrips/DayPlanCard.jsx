import { useLanguage } from '../../i18n/LanguageContext'

function DayPlanCard({ day }) {
  const { t } = useLanguage()
  return (
    <div className="dayCard">
      <div className="dayHead">
        <div className="dayTitle">
          {t('aiTrips.dayLabel', { params: { day: day.day } })}
        </div>
        <div className="daySubtitle">{day.title}</div>
      </div>

      <div className="dayBody">
        {day.items.map((item, index) => (
          <div className="activity" key={`${day.day}-${index}`}>
            <div className="activityRow">
              <div className="activityTitle">
                {item.time} — {item.name}
              </div>
              <div className="activityCost">
                {item.estimatedCost} {t('aiTrips.currency')}
              </div>
            </div>
            <div className="activityNote">{item.note}</div>
            <div className="activityActions">
              <button type="button" className="secondaryBtn">
                {t('aiTrips.activity.addToBooking')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DayPlanCard
