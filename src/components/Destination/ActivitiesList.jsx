import { useNavigate } from 'react-router-dom'

function ActivitiesList({ activities, destinationId }) {
  const navigate = useNavigate()

  if (!activities?.length) {
    return <p className="activitiesEmpty">لا توجد فعاليات متاحة حالياً.</p>
  }

  return (
    <div className="activitiesGrid">
      {activities.map((activity) => {
        const hasPrice = activity.priceFrom !== undefined && activity.priceFrom !== null && activity.priceFrom !== ''
        const priceLabel = hasPrice ? `يبدأ من ${activity.priceFrom} ر.س` : 'سعر حسب الطلب'
        const canBook = activity.isAvailable !== false

        const handleBooking = () => {
          const params = new URLSearchParams()
          if (destinationId) params.set('destinationId', destinationId)
          if (activity.id) params.set('activityId', activity.id)

          navigate(`/checkout?${params.toString()}`)
        }

        return (
          <article className="activityCard" key={activity.id}>
            <div className="activityImage">
              <img src={activity.image} alt={activity.title} loading="lazy" />
            </div>
            <div className="activityBody">
              <div className="activityHead">
                <h3 className="activityTitle">{activity.title}</h3>
                <span className="activityType">{activity.type}</span>
              </div>
              <p className="activityDescription">{activity.description}</p>
              <div className="activityMeta">
                <span>{activity.duration}</span>
                <span>{priceLabel}</span>
              </div>
              <div className="activityAction">
                {canBook ? (
                  <button className="activityBtn" type="button" onClick={handleBooking}>
                    احجز الآن
                  </button>
                ) : (
                  <button className="activityBtn disabled" type="button" disabled>
                    قريباً
                  </button>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default ActivitiesList
