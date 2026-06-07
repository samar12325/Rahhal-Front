import { useLanguage } from '../../i18n/LanguageContext'

function DayPlanCard({ day }) {
  const { t } = useLanguage()

  return (
    <article className="dayCard">
      <div className="dayHead">
        <div>
          <div className="dayTitle">
            {t('aiTrips.dayLabel', { params: { day: day.day } })}
          </div>
          <div className="daySubtitle">{day.title}</div>
          {day.subtitle ? <p className="dayMetaText">{day.subtitle}</p> : null}
        </div>
        {day.estimatedTotal ? (
          <div className="dayBudgetBadge">
            {day.estimatedTotal} {t('aiTrips.currency')}
          </div>
        ) : null}
      </div>

      <div className="dayBody">
        {day.items.map((item, index) => (
          <div className="activity" key={`${day.day}-${index}`}>
            <div className="activityMeta">
              <span className="activityTime">{item.time}</span>
              {item.tag ? <span className="activityTag">{item.tag}</span> : null}
            </div>
            <div className="activityCard">
              <div className="activityRow">
                <div className="activityTitle">{item.name}</div>
                <div className="activityCost">
                  {item.estimatedCost} {t('aiTrips.currency')}
                </div>
              </div>
              <div className="activityNote">{item.note}</div>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default DayPlanCard
