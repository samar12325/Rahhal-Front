import { useCallback, useEffect, useMemo, useState } from 'react'
import '../Home/Home.css'
import '../AdminTrips/AdminTrips.css'
import './AdminApprovals.css'
import { apiRequest, resolveApiUrl } from '../../api/client'
import { isAdminUser, readStoredUser } from '../../auth/session'
import { useLanguage } from '../../i18n/LanguageContext'
import { localizeGroupTripValue } from '../../components/groupTrips/groupTripsLocale'
import {
  localizeSchoolTripName,
  localizeSchoolTripSchool,
  localizeSchoolTripTitle,
} from '../../components/schoolTrips/schoolTripsLocale'

const copy = {
  ar: {
    status: {
      pending: 'قيد المراجعة',
      approved: 'تمت الموافقة',
      rejected: 'مرفوضة',
    },
    statusFilter: {
      all: 'كل الحالات',
      pending: 'قيد المراجعة',
      approved: 'تمت الموافقة',
      rejected: 'مرفوضة',
    },
    heroEyebrow: 'لوحة الإدارة',
    heroTitle: 'طلبات الموافقة على الرحلات',
    heroSubtitle: 'راجع الطلبات القادمة واعتمد ما يستوفي الشروط.',
    stats: {
      total: 'إجمالي الطلبات',
      pending: 'قيد المراجعة',
      approved: 'تمت الموافقة',
      rejected: 'مرفوضة',
    },
    categoryAria: 'تصنيف الطلبات',
    statusAria: 'تصفية الحالات',
    gridAria: 'طلبات الموافقة',
    categories: {
      all: 'الكل',
      school: 'رحلات مدرسية',
      group: 'رحلات جماعية',
    },
    loading: 'جارٍ تحميل الطلبات...',
    loadFailed: 'تعذر تحميل الطلبات',
    retry: 'أعد المحاولة',
    city: 'المدينة',
    schoolTag: 'مدرسية',
    docsTag: 'وثائق',
    groupTag: 'جماعية',
    organizer: 'الجهة المنظمة',
    tripDate: 'تاريخ الرحلة',
    seats: 'عدد المقاعد',
    price: 'السعر المقترح',
    submittedAt: 'تاريخ الإرسال',
    rejectReasonLabel: 'سبب الرفض',
    uploadDocs: 'تحميل الوثائق',
    details: 'تفاصيل',
    reject: 'رفض',
    approve: 'موافقة',
    noPrice: '—',
    noRequestsTitle: 'لا توجد طلبات ضمن هذه التصفية',
    noRequestsSubtitle: 'جرّب تغيير نوع الرحلة أو حالة الطلب لعرض الطلبات.',
    rejectModalTitle: 'سبب رفض الرحلة',
    rejectPlaceholder: 'اكتب سبب الرفض ليظهر لصاحب الطلب...',
    rejectRequired: 'يرجى كتابة سبب الرفض.',
    rejectFailed: 'تعذر رفض الطلب.',
    updateFailed: 'تعذر تحديث حالة الطلب',
    loadErrorFallback: 'تعذر تحميل الطلبات',
    cancel: 'إلغاء',
    confirmReject: 'تأكيد الرفض',
    close: 'إغلاق',
    detailsEyebrow: 'تفاصيل الطلب',
  },
  en: {
    status: {
      pending: 'Pending review',
      approved: 'Approved',
      rejected: 'Rejected',
    },
    statusFilter: {
      all: 'All statuses',
      pending: 'Pending review',
      approved: 'Approved',
      rejected: 'Rejected',
    },
    heroEyebrow: 'Admin panel',
    heroTitle: 'Trip approval requests',
    heroSubtitle: 'Review incoming requests and approve the ones that meet requirements.',
    stats: {
      total: 'Total requests',
      pending: 'Pending review',
      approved: 'Approved',
      rejected: 'Rejected',
    },
    categoryAria: 'Request categories',
    statusAria: 'Status filters',
    gridAria: 'Approval requests',
    categories: {
      all: 'All',
      school: 'School trips',
      group: 'Group trips',
    },
    loading: 'Loading requests...',
    loadFailed: 'Unable to load requests',
    retry: 'Retry',
    city: 'City',
    schoolTag: 'School',
    docsTag: 'Documents',
    groupTag: 'Group',
    organizer: 'Organizer',
    tripDate: 'Trip date',
    seats: 'Seats',
    price: 'Proposed price',
    submittedAt: 'Submitted at',
    rejectReasonLabel: 'Rejection reason',
    uploadDocs: 'Upload documents',
    details: 'Details',
    reject: 'Reject',
    approve: 'Approve',
    noPrice: '—',
    noRequestsTitle: 'No requests match this filter',
    noRequestsSubtitle: 'Try changing the trip type or request status.',
    rejectModalTitle: 'Reason for rejecting the trip',
    rejectPlaceholder: 'Write the reason that the requester will see...',
    rejectRequired: 'Please enter a rejection reason.',
    rejectFailed: 'Unable to reject the request.',
    updateFailed: 'Unable to update request status',
    loadErrorFallback: 'Unable to load requests',
    cancel: 'Cancel',
    confirmReject: 'Confirm rejection',
    close: 'Close',
    detailsEyebrow: 'Request details',
  },
}

function formatDate(value, locale) {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(value))
  } catch {
    return value
  }
}

function getDocumentUrl(fileUrl) {
  if (!fileUrl) return null
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl
  return resolveApiUrl(fileUrl)
}

function getLocalizedApprovalRequest(request, language) {
  if (!request || language === 'ar') return request

  if (request.isSchoolTrip) {
    return {
      ...request,
      tripTitle: localizeSchoolTripTitle(language, request.tripTitle),
      city: localizeSchoolTripName(language, request.city),
      organizer: localizeSchoolTripSchool(language, request.organizer),
    }
  }

  if (request.isGroupTrip) {
    return {
      ...request,
      tripTitle: localizeGroupTripValue(language, 'titles', request.tripTitle),
      city: localizeGroupTripValue(language, 'cities', request.city),
      note: localizeGroupTripValue(language, 'descriptions', request.note),
    }
  }

  return request
}

function AdminApprovals() {
  const { language, dir } = useLanguage()
  const text = copy[language] ?? copy.ar
  const locale = language === 'en' ? 'en-US' : 'ar-SA'
  const currentUser = readStoredUser()
  const isAdmin = isAdminUser(currentUser)
  const [requests, setRequests] = useState([])
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState('')
  const [detailsRequest, setDetailsRequest] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const payload = await apiRequest('/admin/approvals')
      const items = Array.isArray(payload?.items) ? payload.items : []
      setRequests(items)
    } catch (err) {
      setError(err?.message || text.loadErrorFallback)
      setRequests([])
    } finally {
      setLoading(false)
    }
  }, [text.loadErrorFallback])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const stats = useMemo(() => {
    const pending = requests.filter((item) => item.status === 'pending').length
    const approved = requests.filter((item) => item.status === 'approved').length
    const rejected = requests.filter((item) => item.status === 'rejected').length
    return { pending, approved, rejected, total: requests.length }
  }, [requests])

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (statusFilter !== 'all' && request.status !== statusFilter) return false
      if (categoryFilter === 'school') return request.isSchoolTrip
      if (categoryFilter === 'group') return request.isGroupTrip
      return categoryFilter === 'all'
    })
  }, [requests, categoryFilter, statusFilter])

  const handleApprove = async (id) => {
    try {
      const updated = await apiRequest(`/admin/approvals/${id}/approve`, {
        method: 'PATCH',
      })
      setRequests((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updated } : item)),
      )
      if (detailsRequest?.id === id) {
        setDetailsRequest((prev) => (prev ? { ...prev, ...updated } : prev))
      }
    } catch (err) {
      setError(err?.message || text.updateFailed)
    }
  }

  const handleRejectOpen = (id) => {
    setRejectingId(id)
    setRejectReason('')
    setRejectError('')
  }

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      setRejectError(text.rejectRequired)
      return
    }

    try {
      const updated = await apiRequest(`/admin/approvals/${rejectingId}/reject`, {
        method: 'PATCH',
        body: { reason: rejectReason.trim() },
      })
      setRequests((prev) =>
        prev.map((item) => (item.id === rejectingId ? { ...item, ...updated } : item)),
      )
      if (detailsRequest?.id === rejectingId) {
        setDetailsRequest((prev) => (prev ? { ...prev, ...updated } : prev))
      }
      setRejectingId(null)
      setRejectReason('')
      setRejectError('')
    } catch (err) {
      setRejectError(err?.message || text.rejectFailed)
    }
  }

  const handleOpenDocuments = (request) => {
    const documentUrl = getDocumentUrl(request.permitFileUrl)
    if (!documentUrl) return
    window.open(documentUrl, '_blank', 'noopener,noreferrer')
  }

  const detailsLocalizedRequest = getLocalizedApprovalRequest(detailsRequest, language)

  return (
    <div className="home adminTripsPage adminApprovalsPage" dir={dir}>
      <main className="adminTripsMain">
        <section className="adminHero">
          <div className="adminHeroText">
            <p className="adminEyebrow">{text.heroEyebrow}</p>
            <h1>{text.heroTitle}</h1>
            <p className="adminSubtitle">{text.heroSubtitle}</p>
          </div>
          <div className="adminHeroActions adminStatsGrid">
            <div className="adminStat">
              <span>{text.stats.total}</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="adminStat">
              <span>{text.stats.pending}</span>
              <strong>{stats.pending}</strong>
            </div>
            <div className="adminStat">
              <span>{text.stats.approved}</span>
              <strong>{stats.approved}</strong>
            </div>
            <div className="adminStat">
              <span>{text.stats.rejected}</span>
              <strong>{stats.rejected}</strong>
            </div>
          </div>
        </section>

        <section className="approvalsFilters" aria-label={text.categoryAria}>
          <button
            className={`filterChip ${categoryFilter === 'all' ? 'active' : ''}`}
            type="button"
            onClick={() => setCategoryFilter('all')}
          >
            {text.categories.all}
          </button>
          <button
            className={`filterChip ${categoryFilter === 'school' ? 'active' : ''}`}
            type="button"
            onClick={() => setCategoryFilter('school')}
          >
            {text.categories.school}
          </button>
          <button
            className={`filterChip ${categoryFilter === 'group' ? 'active' : ''}`}
            type="button"
            onClick={() => setCategoryFilter('group')}
          >
            {text.categories.group}
          </button>
        </section>

        <section className="approvalsFilters" aria-label={text.statusAria}>
          {Object.entries(text.statusFilter).map(([value, label]) => (
            <button
              key={value}
              className={`filterChip ${statusFilter === value ? 'active' : ''}`}
              type="button"
              onClick={() => setStatusFilter(value)}
            >
              {label}
            </button>
          ))}
        </section>

        <section className="approvalsGrid" aria-label={text.gridAria}>
          {loading ? (
            <div className="adminEmptyState">
              <h3>{text.loading}</h3>
            </div>
          ) : error ? (
            <div className="adminEmptyState">
              <h3>{text.loadFailed}</h3>
              <p className="approvalMeta">{error}</p>
              <button className="secondaryBtn" type="button" onClick={fetchRequests}>
                {text.retry}
              </button>
            </div>
          ) : filteredRequests.length ? (
            filteredRequests.map((request) => {
              const localizedRequest = getLocalizedApprovalRequest(request, language)

              return (
                <article className="approvalCard" key={request.id}>
                  <header className="approvalHeader">
                    <div>
                      <h3>{localizedRequest.tripTitle}</h3>
                      <p className="approvalMeta">
                        {text.city}: {localizedRequest.city}
                      </p>
                      <div className="approvalTags">
                        {localizedRequest.isSchoolTrip ? <span className="tag">{text.schoolTag}</span> : null}
                        {localizedRequest.hasDocuments ? <span className="tag">{text.docsTag}</span> : null}
                        {localizedRequest.isGroupTrip ? <span className="tag">{text.groupTag}</span> : null}
                      </div>
                    </div>
                    <span className={`approvalStatus ${localizedRequest.status}`}>
                      {text.status[localizedRequest.status]}
                    </span>
                  </header>

                  <div className="approvalBody">
                    <div className="approvalRow">
                      <span>{text.organizer}</span>
                      <strong>{localizedRequest.organizer}</strong>
                    </div>
                    <div className="approvalRow">
                      <span>{text.tripDate}</span>
                      <strong>{formatDate(localizedRequest.date, locale)}</strong>
                    </div>
                    <div className="approvalRow">
                      <span>{text.seats}</span>
                      <strong>{localizedRequest.people}</strong>
                    </div>
                    <div className="approvalRow">
                      <span>{text.price}</span>
                      <strong>
                        {localizedRequest.price !== null && localizedRequest.price !== undefined
                          ? `${localizedRequest.price} ${language === 'en' ? 'SAR' : 'ر.س'}`
                          : text.noPrice}
                      </strong>
                    </div>
                    <div className="approvalRow">
                      <span>{text.submittedAt}</span>
                      <strong>{formatDate(localizedRequest.submittedAt, locale)}</strong>
                    </div>
                    {localizedRequest.note ? <p className="approvalNote">{localizedRequest.note}</p> : null}
                    {localizedRequest.status === 'rejected' && localizedRequest.rejectedReason ? (
                      <p className="approvalRejectReason">
                        {text.rejectReasonLabel}: {localizedRequest.rejectedReason}
                      </p>
                    ) : null}
                  </div>

                  <div className="approvalActions">
                    <button
                      className="secondaryBtn uploadDocsBtn"
                      type="button"
                      onClick={() => handleOpenDocuments(localizedRequest)}
                      disabled={!localizedRequest.permitFileUrl}
                    >
                      {text.uploadDocs}
                    </button>
                    <button
                      className="secondaryBtn detailsBtn"
                      type="button"
                      onClick={() => setDetailsRequest(request)}
                    >
                      {text.details}
                    </button>
                    {isAdmin && localizedRequest.status === 'pending' ? (
                      <>
                        <button
                          className="secondaryBtn"
                          type="button"
                          onClick={() => handleRejectOpen(request.id)}
                        >
                          {text.reject}
                        </button>
                        <button
                          className="primaryBtn"
                          type="button"
                          onClick={() => handleApprove(request.id)}
                        >
                          {text.approve}
                        </button>
                      </>
                    ) : null}
                  </div>
                </article>
              )
            })
          ) : (
            <div className="adminEmptyState">
              <h3>{text.noRequestsTitle}</h3>
              <p className="approvalMeta">{text.noRequestsSubtitle}</p>
            </div>
          )}
        </section>
      </main>

      {rejectingId ? (
        <div className="adminModal" role="dialog" aria-modal="true">
          <div className="adminModalCard confirmCard">
            <h3>{text.rejectModalTitle}</h3>
            <textarea
              className="rejectTextarea"
              rows="4"
              placeholder={text.rejectPlaceholder}
              value={rejectReason}
              onChange={(event) => {
                setRejectReason(event.target.value)
                setRejectError('')
              }}
            />
            {rejectError ? <p className="rejectError">{rejectError}</p> : null}
            <div className="adminModalActions">
              <button className="secondaryBtn" type="button" onClick={() => setRejectingId(null)}>
                {text.cancel}
              </button>
              <button className="primaryBtn danger" type="button" onClick={handleRejectConfirm}>
                {text.confirmReject}
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
              aria-label={text.close}
            >
              ×
            </button>
            <p className="adminEyebrow">{text.detailsEyebrow}</p>
            <h3>{detailsLocalizedRequest.tripTitle}</h3>
            <p className="approvalMeta">
              {text.city}: {detailsLocalizedRequest.city}
            </p>
            <div className="approvalTags">
              {detailsLocalizedRequest.isSchoolTrip ? <span className="tag">{text.schoolTag}</span> : null}
              {detailsLocalizedRequest.hasDocuments ? <span className="tag">{text.docsTag}</span> : null}
              {detailsLocalizedRequest.isGroupTrip ? <span className="tag">{text.groupTag}</span> : null}
            </div>
            <span className={`approvalStatus ${detailsLocalizedRequest.status}`}>
              {text.status[detailsLocalizedRequest.status]}
            </span>
            <div className="approvalBody">
              <div className="approvalRow">
                <span>{text.organizer}</span>
                <strong>{detailsLocalizedRequest.organizer}</strong>
              </div>
              <div className="approvalRow">
                <span>{text.tripDate}</span>
                <strong>{formatDate(detailsLocalizedRequest.date, locale)}</strong>
              </div>
              <div className="approvalRow">
                <span>{text.seats}</span>
                <strong>{detailsLocalizedRequest.people}</strong>
              </div>
              <div className="approvalRow">
                <span>{text.price}</span>
                <strong>
                  {detailsLocalizedRequest.price !== null && detailsLocalizedRequest.price !== undefined
                    ? `${detailsLocalizedRequest.price} ${language === 'en' ? 'SAR' : 'ر.س'}`
                    : text.noPrice}
                </strong>
              </div>
              <div className="approvalRow">
                <span>{text.submittedAt}</span>
                <strong>{formatDate(detailsLocalizedRequest.submittedAt, locale)}</strong>
              </div>
              {detailsLocalizedRequest.note ? <p className="approvalNote">{detailsLocalizedRequest.note}</p> : null}
              {detailsLocalizedRequest.status === 'rejected' && detailsLocalizedRequest.rejectedReason ? (
                <p className="approvalRejectReason">
                  {text.rejectReasonLabel}: {detailsLocalizedRequest.rejectedReason}
                </p>
              ) : null}
            </div>
            {detailsLocalizedRequest.permitFileUrl ? (
              <div className="approvalActions">
                <button
                  className="secondaryBtn uploadDocsBtn"
                  type="button"
                  onClick={() => handleOpenDocuments(detailsLocalizedRequest)}
                >
                  {text.uploadDocs}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AdminApprovals
