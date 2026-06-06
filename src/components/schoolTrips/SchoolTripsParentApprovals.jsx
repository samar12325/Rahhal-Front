import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'
import { localizeApprovalStatus } from './schoolTripsLocale'

const copy = {
  ar: {
    title: 'موافقات أولياء الأمور',
    subtitle: 'أضف الطالب وولي الأمر لإنشاء رابط موافقة مستقل لكل طالب.',
    studentName: 'اسم الطالب',
    parentName: 'اسم ولي الأمر',
    parentPhone: 'رقم جوال ولي الأمر',
    parentEmail: 'البريد الإلكتروني لولي الأمر',
    approvalLink: 'رابط الموافقة',
    approvalStatus: 'حالة الموافقة',
    actions: 'إجراء',
    createLink: 'إنشاء رابط الموافقة',
    copyLink: 'نسخ الرابط',
    delete: 'حذف',
    noTrip: 'يجب إنشاء الرحلة أولاً قبل إضافة موافقات أولياء الأمور.',
    empty: 'لا توجد موافقات مضافة لهذه الرحلة حتى الآن.',
    placeholders: {
      studentName: 'مثال: أحمد محمد',
      parentName: 'مثال: محمد أحمد',
      parentEmail: 'parent@example.com',
    },
    messages: {
      missingFields: 'يرجى إدخال اسم الطالب واسم ولي الأمر ورقم الجوال والبريد الإلكتروني.',
      invalidPhone: 'يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05 ويتكون من 10 أرقام.',
      emailSent: 'تم إنشاء رابط الموافقة وإرسال البريد الإلكتروني.',
      emailNotSent: 'تم إنشاء رابط الموافقة، لكن تعذر إرسال البريد الإلكتروني.',
      createFailed: 'تعذر إنشاء رابط الموافقة.',
      copied: 'تم نسخ رابط الموافقة.',
      deleted: 'تم حذف سجل الموافقة.',
      deleteFailed: 'تعذر حذف سجل الموافقة.',
    },
    statuses: {
      pending: 'بانتظار الرد',
      approved: 'موافق',
      rejected: 'غير موافق',
    },
  },
  en: {
    title: 'Parent approvals',
    subtitle: 'Add the student and parent to create a separate approval link for each student.',
    studentName: 'Student name',
    parentName: 'Parent name',
    parentPhone: 'Parent phone',
    parentEmail: 'Parent email',
    approvalLink: 'Approval link',
    approvalStatus: 'Approval status',
    actions: 'Actions',
    createLink: 'Create approval link',
    copyLink: 'Copy link',
    delete: 'Delete',
    noTrip: 'Create the trip first before adding parent approvals.',
    empty: 'No approvals have been added for this trip yet.',
    placeholders: {
      studentName: 'Example: Ahmed Mohammed',
      parentName: 'Example: Mohammed Ahmed',
      parentEmail: 'parent@example.com',
    },
    messages: {
      missingFields: 'Enter the student name, parent name, phone number, and email.',
      invalidPhone: 'Enter a valid Saudi mobile number starting with 05 and containing 10 digits.',
      emailSent: 'Approval link created and email sent.',
      emailNotSent: 'Approval link created, but the email could not be sent.',
      createFailed: 'Could not create the approval link.',
      copied: 'Approval link copied.',
      deleted: 'Approval record deleted.',
      deleteFailed: 'Could not delete the approval record.',
    },
    statuses: {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
    },
  },
}

const getApprovalTripId = (approval) => approval.tripId ?? approval.trip_id

function SchoolTripsParentApprovals({ tripId, embedded = false, onApprovalsChanged }) {
  const { language } = useLanguage()
  const text = copy[language] ?? copy.ar
  const [approvals, setApprovals] = useState([])
  const [studentName, setStudentName] = useState('')
  const [parentName, setParentName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!tripId) return

    let isMounted = true

    apiRequest(`/api/school-trips/parent-approvals?trip_id=${tripId}`)
      .then((data) => {
        if (!isMounted) return

        const normalized = Array.isArray(data)
          ? data.map((approval) => ({
              ...approval,
              tripId: getApprovalTripId(approval),
            }))
          : []

        setApprovals(normalized)
      })
      .catch(() => {
        if (isMounted) setApprovals([])
      })

    return () => {
      isMounted = false
    }
  }, [tripId])

  const filteredApprovals = useMemo(() => {
    if (!tripId) return []

    return approvals.filter((approval) => {
      const approvalTripId = approval.tripId ?? approval.trip_id
      return String(approvalTripId) === String(tripId)
    })
  }, [approvals, tripId])

  const handlePhoneChange = (event) => {
    setParentPhone(event.target.value.replace(/\D/g, '').slice(0, 10))
  }

  const handleAddApproval = async () => {
    const trimmedStudentName = studentName.trim()
    const trimmedParentName = parentName.trim()
    const trimmedParentPhone = parentPhone.trim()
    const trimmedParentEmail = parentEmail.trim().toLowerCase()

    if (!trimmedStudentName || !trimmedParentName || !trimmedParentPhone || !trimmedParentEmail) {
      setMessage(text.messages.missingFields)
      return
    }

    if (!/^05\d{8}$/.test(trimmedParentPhone)) {
      setMessage(text.messages.invalidPhone)
      return
    }

    if (!tripId) {
      setMessage(text.noTrip)
      return
    }

    try {
      const result = await apiRequest('/api/school-trips/parent-approvals', {
        method: 'POST',
        body: {
          trip_id: Number(tripId),
          studentName: trimmedStudentName,
          parentName: trimmedParentName,
          parentPhone: trimmedParentPhone,
          parentEmail: trimmedParentEmail,
        },
      })

      const createdApproval = result.approval || result
      const normalizedApproval = {
        ...createdApproval,
        tripId: createdApproval.tripId ?? createdApproval.trip_id ?? String(tripId),
      }

      setApprovals((prev) => [normalizedApproval, ...prev])
      setStudentName('')
      setParentName('')
      setParentPhone('')
      setParentEmail('')
      onApprovalsChanged?.()
      setMessage(result.emailSent ? text.messages.emailSent : text.messages.emailNotSent)
    } catch (error) {
      setMessage(error?.message || text.messages.createFailed)
    }
  }

  const handleCopy = async (approvalLink) => {
    const link = `${window.location.origin}${approvalLink}`

    if (!navigator.clipboard) {
      setMessage(link)
      return
    }

    await navigator.clipboard.writeText(link)
    setMessage(text.messages.copied)
  }

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/api/school-trips/parent-approvals/${id}`, {
        method: 'DELETE',
      })
      setApprovals((prev) => prev.filter((approval) => approval.id !== id))
      onApprovalsChanged?.()
      setMessage(text.messages.deleted)
    } catch (error) {
      setMessage(error?.message || text.messages.deleteFailed)
    }
  }

  return (
    <section className={embedded ? 'schoolParentApprovals embedded' : 'schoolCard schoolParentApprovals'}>
      <div className="schoolCardHeader">
        <div>
          <h2>{text.title}</h2>
          <p>{text.subtitle}</p>
        </div>
      </div>

      <form className="schoolApprovalForm" onSubmit={(event) => event.preventDefault()}>
        <div className="schoolField">
          <label htmlFor="approval-student-name">{text.studentName}</label>
          <input
            id="approval-student-name"
            className="schoolInput"
            type="text"
            disabled={!tripId}
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
            placeholder={text.placeholders.studentName}
          />
        </div>
        <div className="schoolField">
          <label htmlFor="approval-parent-name">{text.parentName}</label>
          <input
            id="approval-parent-name"
            className="schoolInput"
            type="text"
            disabled={!tripId}
            value={parentName}
            onChange={(event) => setParentName(event.target.value)}
            placeholder={text.placeholders.parentName}
          />
        </div>
        <div className="schoolField">
          <label htmlFor="approval-parent-phone">{text.parentPhone}</label>
          <input
            id="approval-parent-phone"
            className="schoolInput"
            type="tel"
            inputMode="numeric"
            pattern="05[0-9]{8}"
            maxLength="10"
            disabled={!tripId}
            value={parentPhone}
            onChange={handlePhoneChange}
            placeholder="05XXXXXXXX"
          />
        </div>
        <div className="schoolField">
          <label htmlFor="approval-parent-email">{text.parentEmail}</label>
          <input
            id="approval-parent-email"
            className="schoolInput"
            type="email"
            disabled={!tripId}
            value={parentEmail}
            onChange={(event) => setParentEmail(event.target.value)}
            placeholder={text.placeholders.parentEmail}
          />
        </div>
        <button className="primaryBtn" type="button" onClick={handleAddApproval} disabled={!tripId}>
          {text.createLink}
        </button>
      </form>

      {message ? <p className="schoolFormMessage">{message}</p> : null}
      {!tripId ? <p className="schoolFormMessage">{text.noTrip}</p> : null}

      {tripId ? (
        <div className="schoolApprovalTableWrap">
          <table className="schoolApprovalTable">
            <thead>
              <tr>
                <th>{text.studentName}</th>
                <th>{text.parentName}</th>
                <th>{text.parentPhone}</th>
                <th>{text.parentEmail}</th>
                <th>{text.approvalLink}</th>
                <th>{text.approvalStatus}</th>
                <th>{text.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredApprovals.length ? (
                filteredApprovals.map((approval) => (
                  <tr key={approval.id}>
                    <td>{approval.studentName}</td>
                    <td>{approval.parentName}</td>
                    <td>{approval.parentPhone || '-'}</td>
                    <td>{approval.parentEmail || '-'}</td>
                    <td>
                      <span className="schoolApprovalLink">{approval.approvalLink}</span>
                    </td>
                    <td>
                      <span className={`approvalStatusBadge ${approval.approvalStatus}`}>
                        {localizeApprovalStatus(language, approval.approvalStatus) ||
                          text.statuses[approval.approvalStatus] ||
                          approval.approvalStatus}
                      </span>
                    </td>
                    <td>
                      <div className="schoolApprovalActions">
                        <button
                          className="secondaryBtn"
                          type="button"
                          onClick={() => handleCopy(approval.approvalLink)}
                        >
                          {text.copyLink}
                        </button>
                        <button
                          className="secondaryBtn danger"
                          type="button"
                          onClick={() => handleDelete(approval.id)}
                        >
                          {text.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="schoolApprovalEmpty">
                    {text.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

export default SchoolTripsParentApprovals
