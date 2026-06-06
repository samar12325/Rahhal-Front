import { Link } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'

function BookingSuccess() {
  const { dir } = useLanguage()

  return (
    <div className="checkoutPage" dir={dir}>
      <div className="container">
        <div className="checkoutSuccess" role="status">
          <h1>تم تأكيد الحجز بنجاح</h1>
          <p>اكتملت عملية الدفع التجريبية وتم إنشاء الحجز والدفع الوهمي بنجاح.</p>
          <Link className="backLink" to="/profile#bookings">
            الذهاب إلى حجوزاتي
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookingSuccess
