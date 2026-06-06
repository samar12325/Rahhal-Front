import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'
import '../Home/Home.css'
import '../SchoolTrips/SchoolTrips.css'
import Header from '../Home/components/Header'
import Footer from '../Home/components/Footer'

const statusLabels = {
  pending: 'بانتظار الرد',
  approved: 'موافق',
  rejected: 'غير موافق',
}

function ParentApproval() {
  const { token } = useParams()
  const { dir } = useLanguage()
  const [approval, setApproval] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadApproval = async () => {
      setLoading(true)
      try {
        const data = await apiRequest(`/api/school-trips/parent-approvals/token/${token}`)
        if (isMounted) setApproval(data)
      } catch {
        if (isMounted) setApproval(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadApproval()
    return () => {
      isMounted = false
    }
  }, [token])

  const handleStatusChange = async (approvalStatus) => {
    const updated = await apiRequest(`/api/school-trips/parent-approvals/token/${token}`, {
      method: 'PATCH',
      body: { approvalStatus },
    })
    setApproval(updated)
  }

  return (
    <div className="home schoolTripsPage" dir={dir}>
      <Header />

      <main className="schoolTripsMain">
        <section className="schoolCard parentApprovalPage">
          {!loading && !approval ? (
            <div className="parentApprovalEmpty">
              <h1>رابط الموافقة غير موجود</h1>
              <p>تحقق من الرابط أو اطلب رابطاً جديداً من المدرسة.</p>
              <Link className="secondaryBtn" to="/school-trips">
                العودة للرحلات المدرسية
              </Link>
            </div>
          ) : null}

          {loading ? <div className="parentApprovalEmpty">جاري تحميل بيانات الموافقة...</div> : null}

          {!loading && approval ? (
            <>
              <div className="schoolCardHeader">
                <div>
                  <h1>موافقة ولي الأمر</h1>
                  <p>يرجى مراجعة بيانات الرحلة ثم اختيار الموافقة أو عدم الموافقة.</p>
                </div>
                <span className={`approvalStatusBadge ${approval.approvalStatus}`}>
                  {statusLabels[approval.approvalStatus]}
                </span>
              </div>

              <div className="parentApprovalDetails">
                <div className="schoolTripInfoItem">
                  <span className="schoolTripLabel">اسم الطالب</span>
                  <span className="schoolTripValue">{approval.studentName}</span>
                </div>
                <div className="schoolTripInfoItem">
                  <span className="schoolTripLabel">اسم ولي الأمر</span>
                  <span className="schoolTripValue">{approval.parentName}</span>
                </div>
                <div className="schoolTripInfoItem">
                  <span className="schoolTripLabel">اسم الرحلة</span>
                  <span className="schoolTripValue">{approval.tripName}</span>
                </div>
              </div>

              <div className="parentApprovalActions">
                <button
                  className="primaryBtn"
                  type="button"
                  onClick={() => handleStatusChange('approved')}
                >
                  أوافق
                </button>
                <button
                  className="secondaryBtn danger"
                  type="button"
                  onClick={() => handleStatusChange('rejected')}
                >
                  لا أوافق
                </button>
              </div>
            </>
          ) : null}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ParentApproval
