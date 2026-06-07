import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'
import Header from '../Home/components/Header'
import Footer from '../Home/components/Footer'
import '../Home/Home.css'
import '../SchoolTrips/SchoolTrips.css'
import {
  localizeApprovalStatus,
  localizeSchoolTripGrade,
  localizeSchoolTripName,
  localizeSchoolTripTitle,
} from '../../components/schoolTrips/schoolTripsLocale'

const POLL_INTERVAL_MS = 10000

const formatDateTime = (value, locale) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function SchoolTripPreparation() {
  const { tripId } = useParams()
  const { dir, language, t } = useLanguage()
  const locale = language === 'ar' ? 'ar-SA' : 'en-US'
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busyKey, setBusyKey] = useState('')
  const [notes, setNotes] = useState('')

  const text = useMemo(
    () =>
      language === 'ar'
        ? {
            title: 'تحضير الطلاب',
            subtitle: 'تعرض هذه الصفحة الطلاب الذين تمت الموافقة عليهم فقط.',
            back: 'العودة للرحلات المدرسية',
            sendLinks: 'إرسال رابط التتبع للأهالي',
            startTrip: 'بدء الرحلة',
            finishTrip: 'إنهاء الرحلة',
            saveNotes: 'حفظ ملاحظات المشرف',
            lastUpdated: 'آخر تحديث',
            notes: 'ملاحظات المشرف',
            tripStatus: 'حالة الرحلة',
            departureTime: 'وقت الانطلاق',
            returnTime: 'وقت العودة',
            totalApproved: 'إجمالي الموافق عليهم',
            present: 'الحاضرين',
            absent: 'الغائبين',
            unprepared: 'لم يتم تحضيرهم',
            studentName: 'اسم الطالب',
            grade: 'الصف أو المرحلة',
            approvalStatus: 'حالة موافقة ولي الأمر',
            attendanceStatus: 'حالة التحضير',
            attendanceTime: 'وقت التحضير',
            supervisor: 'اسم المشرف',
            actions: 'الإجراءات',
            markPresent: 'حاضر',
            markAbsent: 'غائب',
            loading: 'جارٍ تحميل بيانات التحضير...',
            empty: 'لا يوجد طلاب تمت الموافقة عليهم لهذه الرحلة حتى الآن.',
            requestFailed: 'تعذر تنفيذ الطلب.',
            linksSent: 'تم إرسال روابط التتبع للحاضرين فقط.',
            notesSaved: 'تم حفظ ملاحظات المشرف.',
          }
        : {
            title: 'Prepare Students',
            subtitle: 'This page lists only students with approved parent consent.',
            back: 'Back to school trips',
            sendLinks: 'Send tracking links to parents',
            startTrip: 'Start trip',
            finishTrip: 'Finish trip',
            saveNotes: 'Save supervisor notes',
            lastUpdated: 'Last updated',
            notes: 'Supervisor notes',
            tripStatus: 'Trip status',
            departureTime: 'Departure time',
            returnTime: 'Return time',
            totalApproved: 'Approved total',
            present: 'Present',
            absent: 'Absent',
            unprepared: 'Unprepared',
            studentName: 'Student name',
            grade: 'Grade / stage',
            approvalStatus: 'Parent approval',
            attendanceStatus: 'Preparation status',
            attendanceTime: 'Preparation time',
            supervisor: 'Supervisor',
            actions: 'Actions',
            markPresent: 'Present',
            markAbsent: 'Absent',
            loading: 'Loading preparation data...',
            empty: 'No approved students are available for this trip yet.',
            requestFailed: 'Request failed.',
            linksSent: 'Tracking links were sent to present students only.',
            notesSaved: 'Supervisor notes saved.',
          },
    [language],
  )

  useEffect(() => {
    let isMounted = true

    const load = async ({ silent = false } = {}) => {
      if (!silent && isMounted) setLoading(true)
      try {
        const payload = await apiRequest(`/api/school-trips/${tripId}/preparation`)
        if (!isMounted) return
        setData(payload)
        setNotes(payload?.trip?.supervisorNotes ?? '')
        setError('')
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError?.message || text.requestFailed)
      } finally {
        if (isMounted && !silent) setLoading(false)
      }
    }

    load()
    const intervalId = window.setInterval(() => {
      load({ silent: true })
    }, POLL_INTERVAL_MS)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [text.requestFailed, tripId])

  const trip = data?.trip ?? null
  const counters = data?.counters ?? {
    totalApproved: 0,
    present: 0,
    absent: 0,
    unprepared: 0,
  }
  const students = Array.isArray(data?.students) ? data.students : []

  const localizeAttendanceStatus = (value) => {
    if (language === 'ar') {
      if (value === 'present') return 'حاضر'
      if (value === 'absent') return 'غائب'
      return 'لم يتم التحضير'
    }

    if (value === 'present') return 'Present'
    if (value === 'absent') return 'Absent'
    return 'Unprepared'
  }

  const localizeTripStatus = (value) => {
    if (language === 'ar') {
      if (value === 'in_progress') return 'قيد التنفيذ'
      if (value === 'completed') return 'تم الاكتمال'
      return 'تم الإنشاء'
    }

    if (value === 'in_progress') return 'In progress'
    if (value === 'completed') return 'Completed'
    return 'Created'
  }

  const handleAttendanceUpdate = async (approvalId, attendanceStatus) => {
    setBusyKey(`student-${approvalId}`)
    setMessage('')

    try {
      const payload = await apiRequest(
        `/api/school-trips/${tripId}/preparation/students/${approvalId}`,
        {
          method: 'PATCH',
          body: { attendanceStatus },
        },
      )
      setData(payload)
      setNotes(payload?.trip?.supervisorNotes ?? '')
    } catch (requestError) {
      setMessage(requestError?.message || text.requestFailed)
    } finally {
      setBusyKey('')
    }
  }

  const handleSendLinks = async () => {
    setBusyKey('send-links')
    setMessage('')

    try {
      await apiRequest(`/api/school-trips/${tripId}/preparation/send-tracking-links`, {
        method: 'POST',
      })
      const payload = await apiRequest(`/api/school-trips/${tripId}/preparation`)
      setData(payload)
      setNotes(payload?.trip?.supervisorNotes ?? '')
      setMessage(text.linksSent)
    } catch (requestError) {
      setMessage(requestError?.message || text.requestFailed)
    } finally {
      setBusyKey('')
    }
  }

  const handleTripStatusUpdate = async (tripStatus) => {
    setBusyKey(`status-${tripStatus}`)
    setMessage('')

    try {
      const payload = await apiRequest(`/api/school-trips/${tripId}/preparation/status`, {
        method: 'PATCH',
        body: {
          tripStatus,
          supervisorNotes: notes,
        },
      })
      setData(payload)
      setNotes(payload?.trip?.supervisorNotes ?? '')
    } catch (requestError) {
      setMessage(requestError?.message || text.requestFailed)
    } finally {
      setBusyKey('')
    }
  }

  const handleSaveNotes = async () => {
    setBusyKey('save-notes')
    setMessage('')

    try {
      const payload = await apiRequest(`/api/school-trips/${tripId}/preparation/status`, {
        method: 'PATCH',
        body: {
          supervisorNotes: notes,
        },
      })
      setData(payload)
      setNotes(payload?.trip?.supervisorNotes ?? '')
      setMessage(text.notesSaved)
    } catch (requestError) {
      setMessage(requestError?.message || text.requestFailed)
    } finally {
      setBusyKey('')
    }
  }

  return (
    <div className="home schoolTripsPage" dir={dir}>
      <Header />

      <main className="schoolTripsMain">
        <section className="schoolCard schoolTripPreparationPage">
          <div className="schoolCardHeader">
            <div>
              <h1>{text.title}</h1>
              <p>{text.subtitle}</p>
              {trip ? (
                <div className="schoolPreparationMeta">
                  <span>{localizeSchoolTripTitle(language, trip.title)}</span>
                  <span>{localizeSchoolTripName(language, trip.destinationName)}</span>
                  <span>{text.tripStatus}: {localizeTripStatus(trip.liveStatus)}</span>
                  <span>{text.lastUpdated}: {formatDateTime(trip.lastUpdated, locale)}</span>
                </div>
              ) : null}
            </div>
            <Link className="secondaryBtn" to="/school-trips">
              {text.back}
            </Link>
          </div>

          <div className="schoolPreparationActions">
            <button
              className="primaryBtn"
              type="button"
              onClick={handleSendLinks}
              disabled={busyKey === 'send-links'}
            >
              {text.sendLinks}
            </button>
            <button
              className="secondaryBtn"
              type="button"
              onClick={() => handleTripStatusUpdate('in_progress')}
              disabled={busyKey === 'status-in_progress'}
            >
              {text.startTrip}
            </button>
            <button
              className="secondaryBtn"
              type="button"
              onClick={() => handleTripStatusUpdate('completed')}
              disabled={busyKey === 'status-completed'}
            >
              {text.finishTrip}
            </button>
          </div>

          {trip ? (
            <div className="schoolPreparationGrid">
              <div className="schoolReportCard">
                <h4>{text.departureTime}</h4>
                <strong>{formatDateTime(trip.departureTime, locale)}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.returnTime}</h4>
                <strong>{formatDateTime(trip.returnTime, locale)}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.totalApproved}</h4>
                <strong>{counters.totalApproved}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.present}</h4>
                <strong>{counters.present}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.absent}</h4>
                <strong>{counters.absent}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.unprepared}</h4>
                <strong>{counters.unprepared}</strong>
              </div>
            </div>
          ) : null}

          <div className="schoolField">
            <label htmlFor="supervisor-notes">{text.notes}</label>
            <textarea
              id="supervisor-notes"
              className="schoolTextarea"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
            <div className="schoolPreparationActions">
              <button
                className="secondaryBtn"
                type="button"
                onClick={handleSaveNotes}
                disabled={busyKey === 'save-notes'}
              >
                {text.saveNotes}
              </button>
            </div>
          </div>

          {message ? <p className="schoolFormMessage">{message}</p> : null}
          {loading ? <div className="schoolReportEmpty">{text.loading}</div> : null}
          {!loading && error ? <div className="schoolReportEmpty">{error}</div> : null}
          {!loading && !error && !students.length ? (
            <div className="schoolReportEmpty">{text.empty}</div>
          ) : null}

          {!loading && !error && students.length ? (
            <div className="schoolApprovalTableWrap">
              <table className="schoolApprovalTable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{text.studentName}</th>
                    <th>{text.grade}</th>
                    <th>{text.approvalStatus}</th>
                    <th>{text.attendanceStatus}</th>
                    <th>{text.attendanceTime}</th>
                    <th>{text.supervisor}</th>
                    <th>{text.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td>{student.studentName}</td>
                      <td>{localizeSchoolTripGrade(language, student.grade, t) || '-'}</td>
                      <td>
                        <span className={`approvalStatusBadge ${student.approvalStatus}`}>
                          {localizeApprovalStatus(language, student.approvalStatus) || student.approvalStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`approvalStatusBadge ${student.attendanceStatus}`}>
                          {localizeAttendanceStatus(student.attendanceStatus)}
                        </span>
                      </td>
                      <td>{formatDateTime(student.attendanceTime, locale)}</td>
                      <td>{student.supervisorName || '-'}</td>
                      <td>
                        <div className="schoolApprovalActions">
                          <button
                            className="primaryBtn"
                            type="button"
                            onClick={() => handleAttendanceUpdate(student.id, 'present')}
                            disabled={busyKey === `student-${student.id}`}
                          >
                            {text.markPresent}
                          </button>
                          <button
                            className="secondaryBtn danger"
                            type="button"
                            onClick={() => handleAttendanceUpdate(student.id, 'absent')}
                            disabled={busyKey === `student-${student.id}`}
                          >
                            {text.markAbsent}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default SchoolTripPreparation
