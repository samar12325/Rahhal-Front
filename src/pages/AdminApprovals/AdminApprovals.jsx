import { useMemo, useState } from 'react'
import '../Home/Home.css'
import '../AdminTrips/AdminTrips.css'
import './AdminApprovals.css'
import Footer from '../Home/components/Footer'

const initialRequests = [
  {
    id: 'req-101',
    tripTitle: 'رحلة العلا التراثية',
    city: 'العلا',
    organizer: 'شركة رحلات العلا',
    date: '2026-02-12',
    people: 28,
    price: 320,
    submittedAt: '2026-01-20',
    status: 'pending',
    note: 'رحلة ميدانية مع مرشد سياحي معتمد.',
    isSchoolTrip: true,
    hasDocuments: true,
    isGroupTrip: true,
  },
  {
    id: 'req-102',
    tripTitle: 'جولة الرياض الليلية',
    city: 'الرياض',
    organizer: 'مغامرات الرياض',
    date: '2026-03-04',
    people: 18,
    price: 260,
    submittedAt: '2026-01-22',
    status: 'pending',
    note: 'جولة داخلية تشمل أبرز المواقع الليلية.',
    isSchoolTrip: false,
    hasDocuments: false,
    isGroupTrip: true,
  },
  {
    id: 'req-103',
    tripTitle: 'رحلة بحرية - جدة',
    city: 'جدة',
    organizer: 'سياحة البحر الأحمر',
    date: '2026-02-28',
    people: 22,
    price: 410,
    submittedAt: '2026-01-18',
    status: 'pending',
    note: 'يشمل النقل والتأمين ومعدات السلامة.',
    isSchoolTrip: false,
    hasDocuments: true,
    isGroupTrip: true,
  },
]

const statusCopy = {
  pending: 'قيد المراجعة',
  approved: 'تمت الموافقة',
  rejected: 'مرفوضة',
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'long' }).format(new Date(value))
  } catch {
    return value
  }
}

function AdminApprovals() {
  const [requests, setRequests] = useState(initialRequests)
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState('')
  const [detailsRequest, setDetailsRequest] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all')

  const stats = useMemo(() => {
    const pending = requests.filter((item) => item.status === 'pending').length
    const approved = requests.filter((item) => item.status === 'approved').length
    const rejected = requests.filter((item) => item.status === 'rejected').length
    return { pending, approved, rejected, total: requests.length }
  }, [requests])

  const filteredRequests = useMemo(() => {
    if (categoryFilter === 'all') return requests

    return requests.filter((request) => {
      if (categoryFilter === 'school') return request.isSchoolTrip
      if (categoryFilter === 'group') return request.isGroupTrip
      return true
    })
  }, [requests, categoryFilter])

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'approved', rejectedReason: '' } : item
      )
    )
  }

  const handleRejectOpen = (id) => {
    setRejectingId(id)
    setRejectReason('')
    setRejectError('')
  }

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      setRejectError('يرجى كتابة سبب الرفض.')
      return
    }

    setRequests((prev) =>
      prev.map((item) =>
        item.id === rejectingId
          ? { ...item, status: 'rejected', rejectedReason: rejectReason.trim() }
          : item
      )
    )
    setRejectingId(null)
    setRejectReason('')
    setRejectError('')
  }

  return (
    <div className="home adminApprovalsPage" dir="rtl">
      <main className="adminTripsMain">
        <section className="adminHero">
          <div className="adminHeroText">
            <p className="adminEyebrow">لوحة الإدارة</p>
            <h1>طلبات الموافقة على الرحلات</h1>
            <p className="adminSubtitle">راجع الطلبات القادمة واعتمد ما يستوفي الشروط.</p>
          </div>
          <div className="adminHeroActions adminStatsGrid">
            <div className="adminStat">
              <span>إجمالي الطلبات</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="adminStat">
              <span>قيد المراجعة</span>
              <strong>{stats.pending}</strong>
            </div>
            <div className="adminStat">
              <span>تمت الموافقة</span>
              <strong>{stats.approved}</strong>
            </div>
            <div className="adminStat">
              <span>مرفوضة</span>
              <strong>{stats.rejected}</strong>
            </div>
          </div>
        </section>

        <section className="approvalsFilters" aria-label="تصنيف الطلبات">
          <button
            className={`filterChip ${categoryFilter === 'all' ? 'active' : ''}`}
            type="button"
            onClick={() => setCategoryFilter('all')}
          >
            الكل
          </button>
          <button
            className={`filterChip ${categoryFilter === 'school' ? 'active' : ''}`}
            type="button"
            onClick={() => setCategoryFilter('school')}
          >
            رحلات مدرسية
          </button>
          <button
            className={`filterChip ${categoryFilter === 'group' ? 'active' : ''}`}
            type="button"
            onClick={() => setCategoryFilter('group')}
          >
            رحلات جماعية
          </button>
        </section>

        <section className="approvalsGrid" aria-label="طلبات الموافقة">
          {filteredRequests.length ? (
            filteredRequests.map((request) => {
              const inputId = `docs-${request.id}`
              return (
                <article className="approvalCard" key={request.id}>
                  <header className="approvalHeader">
                  <div>
                    <h3>{request.tripTitle}</h3>
                    <p className="approvalMeta">المدينة: {request.city}</p>
                    <div className="approvalTags">
                      {request.isSchoolTrip ? <span className="tag">مدرسية</span> : null}
                      {request.hasDocuments ? <span className="tag">بوثائق</span> : null}
                      {request.isGroupTrip ? <span className="tag">جماعية</span> : null}
                    </div>
                  </div>
                  <span className={`approvalStatus ${request.status}`}>
                    {statusCopy[request.status]}
                  </span>
                </header>

                <div className="approvalBody">
                  <div className="approvalRow">
                    <span>الجهة المنظمة</span>
                    <strong>{request.organizer}</strong>
                  </div>
                  <div className="approvalRow">
                    <span>تاريخ الرحلة</span>
                    <strong>{formatDate(request.date)}</strong>
                  </div>
                  <div className="approvalRow">
                    <span>عدد المقاعد</span>
                    <strong>{request.people}</strong>
                  </div>
                  <div className="approvalRow">
                    <span>السعر المقترح</span>
                    <strong>{request.price} ر.س</strong>
                  </div>
                  <div className="approvalRow">
                    <span>تاريخ الإرسال</span>
                    <strong>{formatDate(request.submittedAt)}</strong>
                  </div>
                  {request.note ? <p className="approvalNote">{request.note}</p> : null}
                  {request.status === 'rejected' && request.rejectedReason ? (
                    <p className="approvalRejectReason">
                      سبب الرفض: {request.rejectedReason}
                    </p>
                  ) : null}
                </div>

                <div className="approvalActions">
                  <label className="secondaryBtn uploadDocsBtn" htmlFor={inputId}>
                    تحميل الوثائق
                  </label>
                  <input
                    id={inputId}
                    className="uploadDocsInput"
                    type="file"
                    multiple
                    accept=".pdf,image/*"
                  />
                  <button
                    className="secondaryBtn detailsBtn"
                    type="button"
                    onClick={() => setDetailsRequest(request)}
                  >
                    تفاصيل
                  </button>
                  {request.status === 'pending' ? (
                    <>
                      <button
                        className="secondaryBtn"
                        type="button"
                        onClick={() => handleRejectOpen(request.id)}
                      >
                        رفض
                      </button>
                      <button
                        className="primaryBtn"
                        type="button"
                        onClick={() => handleApprove(request.id)}
                      >
                        موافقة
                      </button>
                    </>
                  ) : null}
                </div>
                </article>
              )
            })
          ) : (
            <div className="adminEmptyState">
              <h3>لا توجد طلبات ضمن هذا التصنيف</h3>
              <p className="tripMeta">جرّب اختيار تصنيف آخر لعرض الطلبات.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />

      {rejectingId ? (
        <div className="adminModal" role="dialog" aria-modal="true">
          <div className="adminModalCard confirmCard">
            <h3>سبب رفض الرحلة</h3>
            <textarea
              className="rejectTextarea"
              rows="4"
              placeholder="اكتب سبب الرفض ليظهر لصاحب الطلب..."
              value={rejectReason}
              onChange={(event) => {
                setRejectReason(event.target.value)
                setRejectError('')
              }}
            />
            {rejectError ? <p className="rejectError">{rejectError}</p> : null}
            <div className="adminModalActions">
              <button className="secondaryBtn" type="button" onClick={() => setRejectingId(null)}>
                إلغاء
              </button>
              <button className="primaryBtn danger" type="button" onClick={handleRejectConfirm}>
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {detailsRequest ? (
        <div className="adminModal" role="dialog" aria-modal="true">
          <div className="adminModalCard approvalDetailsCard">
            <button
              className="modalClose"
              type="button"
              onClick={() => setDetailsRequest(null)}
              aria-label="إغلاق"
            >
              أ—
            </button>
            <p className="adminEyebrow">تفاصيل الطلب</p>
            <h3>{detailsRequest.tripTitle}</h3>
            <p className="approvalMeta">المدينة: {detailsRequest.city}</p>
            <div className="approvalTags">
              {detailsRequest.isSchoolTrip ? <span className="tag">مدرسية</span> : null}
              {detailsRequest.hasDocuments ? <span className="tag">بوثائق</span> : null}
              {detailsRequest.isGroupTrip ? <span className="tag">جماعية</span> : null}
            </div>
            <span className={`approvalStatus ${detailsRequest.status}`}>
              {statusCopy[detailsRequest.status]}
            </span>
            <div className="approvalBody">
              <div className="approvalRow">
                <span>الجهة المنظمة</span>
                <strong>{detailsRequest.organizer}</strong>
              </div>
              <div className="approvalRow">
                <span>تاريخ الرحلة</span>
                <strong>{formatDate(detailsRequest.date)}</strong>
              </div>
              <div className="approvalRow">
                <span>عدد المقاعد</span>
                <strong>{detailsRequest.people}</strong>
              </div>
              <div className="approvalRow">
                <span>السعر المقترح</span>
                <strong>{detailsRequest.price} ر.س</strong>
              </div>
              <div className="approvalRow">
                <span>تاريخ الإرسال</span>
                <strong>{formatDate(detailsRequest.submittedAt)}</strong>
              </div>
              {detailsRequest.note ? (
                <p className="approvalNote">{detailsRequest.note}</p>
              ) : null}
              {detailsRequest.status === 'rejected' && detailsRequest.rejectedReason ? (
                <p className="approvalRejectReason">
                  سبب الرفض: {detailsRequest.rejectedReason}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AdminApprovals
