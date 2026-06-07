import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'
import Header from '../Home/components/Header'
import Footer from '../Home/components/Footer'
import '../Home/Home.css'
import '../SchoolTrips/SchoolTrips.css'
import { localizeSchoolTripGrade, localizeSchoolTripTitle } from '../../components/schoolTrips/schoolTripsLocale'

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

function ParentTripTracking() {
  const { token } = useParams()
  const { dir, language, t } = useLanguage()
  const locale = language === 'ar' ? 'ar-SA' : 'en-US'
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const text = useMemo(
    () =>
      language === 'ar'
        ? {
            title: 'متابعة الرحلة',
            subtitle: 'هذه الصفحة تعرض حالة الطالب المرتبط بهذا الرابط فقط.',
            empty: 'رابط التتبع غير صالح أو غير متاح.',
            loading: 'جارٍ تحميل بيانات التتبع...',
            back: 'العودة للرحلات المدرسية',
            tripName: 'اسم الرحلة',
            studentName: 'اسم الطالب',
            grade: 'الصف أو المرحلة',
            studentStatus: 'حالة الطالب',
            tripStatus: 'حالة الرحلة',
            departureTime: 'وقت الانطلاق',
            returnTime: 'وقت العودة',
            lastUpdated: 'آخر تحديث',
            attendanceTime: 'وقت التحضير',
            notes: 'ملاحظات المشرف',
          }
        : {
            title: 'Trip tracking',
            subtitle: 'This page shows only the student linked to this token.',
            empty: 'Tracking link is invalid or unavailable.',
            loading: 'Loading tracking details...',
            back: 'Back to school trips',
            tripName: 'Trip name',
            studentName: 'Student name',
            grade: 'Grade / stage',
            studentStatus: 'Student status',
            tripStatus: 'Trip status',
            departureTime: 'Departure time',
            returnTime: 'Return time',
            lastUpdated: 'Last updated',
            attendanceTime: 'Preparation time',
            notes: 'Supervisor notes',
          },
    [language],
  )

  useEffect(() => {
    let isMounted = true

    const load = async ({ silent = false } = {}) => {
      if (!silent && isMounted) setLoading(true)
      try {
        const payload = await apiRequest(`/api/school-trips/tracking/${token}`)
        if (!isMounted) return
        setData(payload)
        setError('')
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError?.message || text.empty)
        setData(null)
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
  }, [text.empty, token])

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

  const localizeStudentStatus = (value) => {
    if (language === 'ar') {
      if (value === 'present') return 'حاضر'
      if (value === 'absent') return 'غائب'
      return 'لم يتم التحضير'
    }

    if (value === 'present') return 'Present'
    if (value === 'absent') return 'Absent'
    return 'Unprepared'
  }

  return (
    <div className="home schoolTripsPage" dir={dir}>
      <Header />

      <main className="schoolTripsMain">
        <section className="schoolCard parentTrackingPage">
          <div className="schoolCardHeader">
            <div>
              <h1>{text.title}</h1>
              <p>{text.subtitle}</p>
            </div>
            <Link className="secondaryBtn" to="/school-trips">
              {text.back}
            </Link>
          </div>

          {loading ? <div className="schoolReportEmpty">{text.loading}</div> : null}
          {!loading && !data ? <div className="schoolReportEmpty">{error || text.empty}</div> : null}

          {!loading && data ? (
            <div className="schoolTrackingGrid">
              <div className="schoolReportCard">
                <h4>{text.tripName}</h4>
                <strong>{localizeSchoolTripTitle(language, data.tripName)}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.studentName}</h4>
                <strong>{data.studentName}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.grade}</h4>
                <strong>{localizeSchoolTripGrade(language, data.grade, t) || '-'}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.studentStatus}</h4>
                <strong>{localizeStudentStatus(data.studentStatus)}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.tripStatus}</h4>
                <strong>{localizeTripStatus(data.tripStatus)}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.attendanceTime}</h4>
                <strong>{formatDateTime(data.attendanceTime, locale)}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.departureTime}</h4>
                <strong>{formatDateTime(data.departureTime, locale)}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.returnTime}</h4>
                <strong>{formatDateTime(data.returnTime, locale)}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.lastUpdated}</h4>
                <strong>{formatDateTime(data.lastUpdated, locale)}</strong>
              </div>
              <div className="schoolReportCard schoolTrackingNotesCard">
                <h4>{text.notes}</h4>
                <p>{data.supervisorNotes || '-'}</p>
              </div>
            </div>
          ) : null}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ParentTripTracking
