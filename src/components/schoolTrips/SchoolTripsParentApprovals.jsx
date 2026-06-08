import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'
import { localizeApprovalStatus } from './schoolTripsLocale'

const copy = {
  ar: {
    title: 'موافقات أولياء الأمور',
    subtitle: 'اختر طريقة الإضافة المناسبة ثم أرسل روابط الموافقة.',
    manualMode: 'إدخال يدوي',
    uploadMode: 'رفع ملف',
    manualTitle: 'إضافة طلاب يدويًا',
    manualHint: 'أدخل بيانات كل طالب ثم أضفه إلى القائمة وأرسل الجميع دفعة واحدة.',
    studentName: 'اسم الطالب',
    parentName: 'اسم ولي الأمر',
    fatherName: 'اسم الأب',
    parentPhone: 'رقم جوال ولي الأمر',
    parentEmail: 'البريد الإلكتروني لولي الأمر',
    approvalLink: 'رابط الموافقة',
    approvalStatus: 'حالة الموافقة',
    actions: 'إجراءات',
    createLink: 'إنشاء رابط الموافقة',
    addToList: 'إضافة إلى القائمة',
    queuedStudentsTitle: 'القائمة الجاهزة',
    queuedStudentsHint: 'الطلاب المضافون: {{count}}',
    noManualRows: 'لم تضف أي طالب بعد.',
    removeRow: 'إزالة',
    copyLink: 'نسخ الرابط',
    delete: 'حذف',
    noTrip: 'يجب إنشاء الرحلة أولًا قبل إضافة موافقات أولياء الأمور.',
    empty: 'لا توجد موافقات مضافة لهذه الرحلة حتى الآن.',
    uploadTitle: 'رفع ملف الطلاب',
    uploadHint: 'ارفع ملفًا يحتوي على بيانات الطلاب وأولياء الأمور.',
    uploadButton: 'اختيار الملف',
    uploadFormats: 'الملفات المدعومة: csv ،xlsx',
    previewTitle: 'معاينة قبل الإرسال',
    previewSummary: 'الإجمالي: {{total}} | الصحيح: {{valid}} | غير الصحيح: {{invalid}}',
    sendAll: 'إرسال للجميع',
    clearPreview: 'مسح المعاينة',
    verificationStatus: 'حالة التحقق',
    validationReasons: 'سبب الرفض',
    sendResultsTitle: 'نتائج الإرسال',
    sendStatus: 'حالة الإرسال',
    sendError: 'الخطأ',
    sendStatuses: {
      sent: 'تم الإرسال',
      failed: 'فشل',
    },
    validationStatuses: {
      valid: 'صحيح',
      invalid: 'غير صحيح',
    },
    placeholders: {
      studentName: 'مثال: أحمد محمد',
      parentName: 'مثال: محمد أحمد',
      parentEmail: 'parent@example.com',
    },
    messages: {
      missingFields: 'يرجى إدخال اسم الطالب واسم ولي الأمر ورقم الجوال والبريد الإلكتروني.',
      invalidPhone: 'يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05 ويتكون من 10 أرقام.',
      invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح.',
      addedToList: 'تمت إضافة الطالب إلى القائمة.',
      noManualRows: 'أضف طالبًا واحدًا على الأقل قبل الإرسال.',
      manualSendSuccess: 'تم إرسال رسائل الموافقة لجميع الطلاب المضافين.',
      manualSendPartial: 'اكتمل الإرسال مع وجود بعض الإخفاقات.',
      manualSendFailed: 'تعذر إرسال رسائل الموافقة من القائمة.',
      emailSent: 'تم إنشاء رابط الموافقة وإرسال البريد الإلكتروني.',
      emailNotSent: 'تم إنشاء رابط الموافقة، لكن تعذر إرسال البريد الإلكتروني.',
      createFailed: 'تعذر إنشاء رابط الموافقة.',
      copied: 'تم نسخ رابط الموافقة.',
      deleted: 'تم حذف سجل الموافقة.',
      deleteFailed: 'تعذر حذف سجل الموافقة.',
      invalidFileType: 'يرجى اختيار ملف Excel أو CSV بصيغة .xlsx أو .csv.',
      previewReady: 'تم رفع الملف والتحقق من البيانات. يمكنك الآن الإرسال.',
      previewInvalid: 'تم رفع الملف لكن توجد صفوف غير صحيحة يجب تصحيحها قبل الإرسال.',
      previewFailed: 'تعذر قراءة الملف المرفوع.',
      sendSuccess: 'تم إرسال رسائل الموافقة لجميع الصفوف الصحيحة.',
      sendPartial: 'اكتمل الإرسال مع وجود بعض الصفوف التي فشلت.',
      sendFailed: 'تعذر إرسال رسائل الموافقة.',
      noPreview: 'ارفع ملفًا صحيحًا أولًا قبل الإرسال الجماعي.',
    },
    statuses: {
      pending: 'بانتظار الرد',
      approved: 'موافق',
      rejected: 'غير موافق',
    },
  },
  en: {
    title: 'Parent approvals',
    subtitle: 'Choose how you want to add students, then send approval links.',
    manualMode: 'Manual entry',
    uploadMode: 'Upload file',
    manualTitle: 'Add students manually',
    manualHint: 'Fill in each student, add them to the list, then send everyone at once.',
    studentName: 'Student name',
    parentName: 'Parent name',
    fatherName: 'Father name',
    parentPhone: 'Parent phone',
    parentEmail: 'Parent email',
    approvalLink: 'Approval link',
    approvalStatus: 'Approval status',
    actions: 'Actions',
    createLink: 'Create approval link',
    addToList: 'Add to list',
    queuedStudentsTitle: 'Ready list',
    queuedStudentsHint: 'Students added: {{count}}',
    noManualRows: 'No students have been added yet.',
    removeRow: 'Remove',
    copyLink: 'Copy link',
    delete: 'Delete',
    noTrip: 'Create the trip first before adding parent approvals.',
    empty: 'No approvals have been added for this trip yet.',
    uploadTitle: 'Upload student file',
    uploadHint: 'Upload a file that contains student and parent details.',
    uploadButton: 'Choose file',
    uploadFormats: 'Supported files: csv, xlsx',
    previewTitle: 'Preview before sending',
    previewSummary: 'Total: {{total}} | Valid: {{valid}} | Invalid: {{invalid}}',
    sendAll: 'Send to all',
    clearPreview: 'Clear preview',
    verificationStatus: 'Verification status',
    validationReasons: 'Validation reason',
    sendResultsTitle: 'Send results',
    sendStatus: 'Send status',
    sendError: 'Error',
    sendStatuses: {
      sent: 'Sent',
      failed: 'Failed',
    },
    validationStatuses: {
      valid: 'Valid',
      invalid: 'Invalid',
    },
    placeholders: {
      studentName: 'Example: Ahmed Mohammed',
      parentName: 'Example: Mohammed Ahmed',
      parentEmail: 'parent@example.com',
    },
    messages: {
      missingFields: 'Enter the student name, parent name, phone number, and email.',
      invalidPhone: 'Enter a valid Saudi mobile number starting with 05 and containing 10 digits.',
      invalidEmail: 'Enter a valid email address.',
      addedToList: 'Student added to the list.',
      noManualRows: 'Add at least one student before sending.',
      manualSendSuccess: 'Approval emails were sent to all listed students.',
      manualSendPartial: 'Sending finished with some failed rows.',
      manualSendFailed: 'Could not send the manual list.',
      emailSent: 'Approval link created and email sent.',
      emailNotSent: 'Approval link created, but the email could not be sent.',
      createFailed: 'Could not create the approval link.',
      copied: 'Approval link copied.',
      deleted: 'Approval record deleted.',
      deleteFailed: 'Could not delete the approval record.',
      invalidFileType: 'Choose an Excel or CSV file with a .xlsx or .csv extension.',
      previewReady: 'The file was uploaded and validated. You can send it now.',
      previewInvalid: 'The file was uploaded, but some rows must be fixed before sending.',
      previewFailed: 'Could not read the uploaded file.',
      sendSuccess: 'Approval emails were sent to all valid rows.',
      sendPartial: 'Sending finished with some failed rows.',
      sendFailed: 'Could not send approval emails.',
      noPreview: 'Upload a valid file before using bulk send.',
    },
    statuses: {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
    },
  },
}

const getApprovalTripId = (approval) => approval.tripId ?? approval.trip_id

const renderSummary = (template, summary) =>
  template
    .replace('{{total}}', String(summary?.totalRows ?? 0))
    .replace('{{valid}}', String(summary?.validRows ?? 0))
    .replace('{{invalid}}', String(summary?.invalidRows ?? 0))

const renderCount = (template, count) => template.replace('{{count}}', String(count))
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

function SchoolTripsParentApprovals({ tripId, embedded = false, onApprovalsChanged }) {
  const { language } = useLanguage()
  const text = copy[language] ?? copy.ar
  const [approvals, setApprovals] = useState([])
  const [studentName, setStudentName] = useState('')
  const [parentName, setParentName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [message, setMessage] = useState('')
  const [manualRows, setManualRows] = useState([])
  const [manualResults, setManualResults] = useState([])
  const [batchMessage, setBatchMessage] = useState('')
  const [batchPreview, setBatchPreview] = useState(null)
  const [batchResults, setBatchResults] = useState([])
  const [uploading, setUploading] = useState(false)
  const [sending, setSending] = useState(false)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [approvalsReloadKey, setApprovalsReloadKey] = useState(0)
  const [activeMethod, setActiveMethod] = useState('manual')

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
  }, [approvalsReloadKey, tripId])

  useEffect(() => {
    setStudentName('')
    setParentName('')
    setParentPhone('')
    setParentEmail('')
    setMessage('')
    setManualRows([])
    setManualResults([])
    setBatchPreview(null)
    setBatchResults([])
    setBatchMessage('')
    setFileInputKey((prev) => prev + 1)
  }, [tripId])

  const filteredApprovals = useMemo(() => {
    if (!tripId) return []

    return approvals.filter((approval) => {
      const approvalTripId = approval.tripId ?? approval.trip_id
      return String(approvalTripId) === String(tripId)
    })
  }, [approvals, tripId])

  const previewRows = Array.isArray(batchPreview?.rows) ? batchPreview.rows : []
  const previewErrors = Array.isArray(batchPreview?.errors) ? batchPreview.errors : []
  const canSendBatch =
    Boolean(tripId) &&
    Boolean(batchPreview?.valid) &&
    previewRows.length > 0 &&
    !uploading &&
    !sending

  const handlePhoneChange = (event) => {
    setParentPhone(event.target.value.replace(/\D/g, '').slice(0, 10))
  }

  const resetManualForm = () => {
    setStudentName('')
    setParentName('')
    setParentPhone('')
    setParentEmail('')
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

    if (!isValidEmail(trimmedParentEmail)) {
      setMessage(text.messages.invalidEmail)
      return
    }

    if (!tripId) {
      setMessage(text.noTrip)
      return
    }

    setSending(true)
    setManualResults([])
    setMessage('')

    try {
      const created = await apiRequest('/api/school-trips/parent-approvals', {
        method: 'POST',
        body: {
          trip_id: Number(tripId),
          studentName: trimmedStudentName,
          parentName: trimmedParentName,
          parentPhone: trimmedParentPhone,
          parentEmail: trimmedParentEmail,
        },
      })

      setApprovals((prev) => [
        {
          ...created,
          tripId: getApprovalTripId(created),
        },
        ...prev,
      ])
      resetManualForm()
      setApprovalsReloadKey((prev) => prev + 1)
      onApprovalsChanged?.()
      setMessage(
        created?.emailSent === false
          ? text.messages.emailNotSent
          : text.messages.emailSent,
      )
    } catch (error) {
      setMessage(error?.message || text.messages.createFailed)
    } finally {
      setSending(false)
    }
  }

  const handleRemoveManualRow = (id) => {
    setManualRows((prev) => prev.filter((row) => row.id !== id))
  }

  const handleSendManualRows = async () => {
    if (!tripId) {
      setMessage(text.noTrip)
      return
    }

    if (!manualRows.length) {
      setMessage(text.messages.noManualRows)
      return
    }

    setSending(true)
    setMessage('')

    try {
      const response = await apiRequest('/trip/send-all', {
        method: 'POST',
        body: {
          tripId: Number(tripId),
          students: manualRows.map((row, index) => ({
            rowNumber: index + 1,
            studentName: row.studentName,
            fatherName: row.parentName,
            parentPhone: row.parentPhone,
            email: row.parentEmail,
          })),
        },
      })

      const results = Array.isArray(response?.results) ? response.results : []
      setManualResults(results)
      setManualRows([])
      setMessage(response?.summary?.failed ? text.messages.manualSendPartial : text.messages.manualSendSuccess)
      setApprovalsReloadKey((prev) => prev + 1)
      onApprovalsChanged?.()
    } catch (error) {
      setMessage(error?.message || text.messages.manualSendFailed)
    } finally {
      setSending(false)
    }
  }

  const handleBatchFileChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      setBatchPreview(null)
      setBatchResults([])
      setBatchMessage('')
      return
    }

    if (!tripId) {
      setBatchMessage(text.noTrip)
      return
    }

    const lowerName = file.name.toLowerCase()
    if (!lowerName.endsWith('.xlsx') && !lowerName.endsWith('.csv')) {
      setBatchPreview(null)
      setBatchResults([])
      setBatchMessage(text.messages.invalidFileType)
      return
    }

    setUploading(true)
    setBatchMessage('')
    setBatchResults([])

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('tripId', String(tripId))

      const response = await apiRequest('/trip/upload-excel', {
        method: 'POST',
        body: formData,
      })

      setBatchPreview(response)
      setBatchMessage(response?.valid ? text.messages.previewReady : text.messages.previewInvalid)
    } catch (error) {
      setBatchPreview(null)
      setBatchMessage(error?.message || text.messages.previewFailed)
    } finally {
      setUploading(false)
    }
  }

  const handleSendAll = async () => {
    if (!tripId || !batchPreview?.valid || !previewRows.length) {
      setBatchMessage(text.messages.noPreview)
      return
    }

    setSending(true)
    setBatchMessage('')

    try {
      const response = await apiRequest('/trip/send-all', {
        method: 'POST',
        body: {
          tripId: Number(tripId),
          students: previewRows.map((row) => ({
            rowNumber: row.rowNumber,
            studentName: row.studentName,
            fatherName: row.fatherName,
            parentPhone: row.parentPhone,
            email: row.email,
          })),
        },
      })

      const results = Array.isArray(response?.results) ? response.results : []
      setBatchResults(results)
      setBatchMessage(response?.summary?.failed ? text.messages.sendPartial : text.messages.sendSuccess)
      setApprovalsReloadKey((prev) => prev + 1)
      onApprovalsChanged?.()
    } catch (error) {
      setBatchMessage(error?.message || text.messages.sendFailed)
    } finally {
      setSending(false)
    }
  }

  const handleClearPreview = () => {
    setBatchPreview(null)
    setBatchResults([])
    setBatchMessage('')
    setFileInputKey((prev) => prev + 1)
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

      <div className="schoolApprovalModes" role="tablist" aria-label={text.title}>
        <button
          className={`schoolApprovalModeBtn ${activeMethod === 'manual' ? 'active' : ''}`}
          type="button"
          onClick={() => setActiveMethod('manual')}
        >
          {text.manualMode}
        </button>
        <button
          className={`schoolApprovalModeBtn ${activeMethod === 'upload' ? 'active' : ''}`}
          type="button"
          onClick={() => setActiveMethod('upload')}
        >
          {text.uploadMode}
        </button>
      </div>

      {activeMethod === 'manual' ? (
        <section className="schoolApprovalPanel">
          <div className="schoolApprovalPanelHeader">
            <h3>{text.manualTitle}</h3>
            <p>{text.manualHint}</p>
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
          </form>

          <div className="schoolApprovalPanelActions">
            <button className="primaryBtn" type="button" onClick={handleAddApproval} disabled={!tripId || sending}>
              {text.addToList}
            </button>
            {manualRows.length ? (
              <button className="secondaryBtn" type="button" onClick={handleSendManualRows} disabled={!tripId || sending}>
                {sending ? `${text.sendAll}...` : text.sendAll}
              </button>
            ) : null}
          </div>

          {message ? <p className="schoolFormMessage">{message}</p> : null}
          {!tripId ? <p className="schoolFormMessage">{text.noTrip}</p> : null}

          {tripId ? (
            manualRows.length ? (
              <div className="schoolBatchPreview schoolManualQueue">
                <div className="schoolBatchPreviewHeader">
                  <div>
                    <h3>{text.queuedStudentsTitle}</h3>
                    <p>{renderCount(text.queuedStudentsHint, manualRows.length)}</p>
                  </div>
                </div>

                <div className="schoolApprovalTableWrap">
                  <table className="schoolApprovalTable">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{text.studentName}</th>
                        <th>{text.parentName}</th>
                        <th>{text.parentPhone}</th>
                        <th>{text.parentEmail}</th>
                        <th>{text.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manualRows.map((row, index) => (
                        <tr key={row.id}>
                          <td>{index + 1}</td>
                          <td>{row.studentName}</td>
                          <td>{row.parentName}</td>
                          <td>{row.parentPhone}</td>
                          <td>{row.parentEmail}</td>
                          <td>
                            <div className="schoolApprovalActions">
                              <button
                                className="secondaryBtn danger"
                                type="button"
                                onClick={() => handleRemoveManualRow(row.id)}
                              >
                                {text.removeRow}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="schoolManualQueueEmpty">{text.noManualRows}</div>
            )
          ) : null}

          {manualResults.length ? (
            <div className="schoolBatchResults">
              <div className="schoolCardHeader">
                <div>
                  <h3>{text.sendResultsTitle}</h3>
                </div>
              </div>
              <div className="schoolApprovalTableWrap">
                <table className="schoolApprovalTable">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{text.parentEmail}</th>
                      <th>{text.sendStatus}</th>
                      <th>{text.sendError}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualResults.map((result, index) => (
                      <tr key={`manual-result-${result.rowNumber || index}-${result.email}`}>
                        <td>{result.rowNumber || index + 1}</td>
                        <td>{result.email}</td>
                        <td>
                          <span className={`approvalStatusBadge ${result.status === 'sent' ? 'approved' : 'rejected'}`}>
                            {text.sendStatuses[result.status] || result.status}
                          </span>
                        </td>
                        <td>{result.error || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>
      ) : (
        <section className="schoolBatchUpload schoolApprovalPanel">
          <div className="schoolApprovalPanelHeader">
            <h3>{text.uploadTitle}</h3>
            <p>{text.uploadHint}</p>
          </div>

          <div className="schoolBatchUploadControls">
            <div className="schoolField schoolBatchFileField">
              <label htmlFor="approval-upload-file">{text.uploadButton}</label>
              <input
                key={fileInputKey}
                id="approval-upload-file"
                className="schoolFileInput"
                type="file"
                accept=".xlsx,.csv"
                onChange={handleBatchFileChange}
                disabled={!tripId || uploading || sending}
              />
              <span className="schoolFileHint">{text.uploadFormats}</span>
            </div>

            {batchPreview ? (
              <button
                className="secondaryBtn"
                type="button"
                onClick={handleClearPreview}
                disabled={uploading || sending}
              >
                {text.clearPreview}
              </button>
            ) : null}
          </div>

          {!tripId ? <p className="schoolFormMessage">{text.noTrip}</p> : null}
          {batchMessage ? <p className="schoolFormMessage">{batchMessage}</p> : null}

          {batchPreview ? (
            <div className="schoolBatchPreview">
              <div className="schoolBatchPreviewHeader">
                <div>
                  <h3>{text.previewTitle}</h3>
                  <p>{renderSummary(text.previewSummary, batchPreview.summary)}</p>
                </div>
                {canSendBatch ? (
                  <button className="primaryBtn" type="button" onClick={handleSendAll} disabled={!canSendBatch}>
                    {sending ? `${text.sendAll}...` : text.sendAll}
                  </button>
                ) : null}
              </div>

              <div className="schoolApprovalTableWrap">
                <table className="schoolApprovalTable schoolPreviewTable">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{text.studentName}</th>
                      <th>{text.fatherName}</th>
                      <th>{text.parentPhone}</th>
                      <th>{text.parentEmail}</th>
                      <th>{text.verificationStatus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row) => (
                      <tr key={`preview-${row.rowNumber}-${row.email}`}>
                        <td>{row.rowNumber}</td>
                        <td>{row.studentName || '-'}</td>
                        <td>{row.fatherName || '-'}</td>
                        <td>{row.parentPhone || '-'}</td>
                        <td>{row.email || '-'}</td>
                        <td>
                          <div className="schoolValidationCell">
                            <span className={`approvalStatusBadge ${row.validationStatus === 'valid' ? 'approved' : 'rejected'}`}>
                              {text.validationStatuses[row.validationStatus] || row.validationStatus}
                            </span>
                            {Array.isArray(row.reasons) && row.reasons.length ? (
                              <span className="schoolValidationReasons">{row.reasons.join(' ')}</span>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!batchPreview.valid && previewErrors.length ? (
                <div className="schoolBatchErrors">
                  {previewErrors.map((error) => (
                    <p key={`preview-error-${error.rowNumber}`}>
                      {`Row ${error.rowNumber}: ${(error.reasons || []).join(' ')}`}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {batchResults.length ? (
            <div className="schoolBatchResults">
              <div className="schoolCardHeader">
                <div>
                  <h3>{text.sendResultsTitle}</h3>
                </div>
              </div>
              <div className="schoolApprovalTableWrap">
                <table className="schoolApprovalTable">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{text.parentEmail}</th>
                      <th>{text.sendStatus}</th>
                      <th>{text.sendError}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchResults.map((result, index) => (
                      <tr key={`result-${result.rowNumber || index}-${result.email}`}>
                        <td>{result.rowNumber || index + 1}</td>
                        <td>{result.email}</td>
                        <td>
                          <span className={`approvalStatusBadge ${result.status === 'sent' ? 'approved' : 'rejected'}`}>
                            {text.sendStatuses[result.status] || result.status}
                          </span>
                        </td>
                        <td>{result.error || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>
      )}

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
