import { useEffect, useMemo, useState } from 'react'
import '../Home/Home.css'
import './SchoolTrips.css'
import Header from '../Home/components/Header'
import Footer from '../Home/components/Footer'
import SchoolTripsHero from '../../components/schoolTrips/SchoolTripsHero'
import SchoolTripsForm from '../../components/schoolTrips/SchoolTripsForm'
import SchoolTripsTimeline from '../../components/schoolTrips/SchoolTripsTimeline'
import SchoolTripsReport from '../../components/schoolTrips/SchoolTripsReport'
import { schoolTrips as initialTrips } from '../../data/schoolTrips.mock'
import { useLanguage } from '../../i18n/LanguageContext'

const emptyForm = {
  title: '',
  destination: '',
  date: '',
  time: '',
  grade: '',
  transport: '',
  studentsCount: '',
  supervisorsCount: '',
  focus: '',
  meetingPoint: '',
  agenda: '',
  notes: '',
  permitFile: null,
  permitFileName: '',
}

const formatDateLabel = (value, locale) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

const formatTimeLabel = (value, locale) => {
  if (!value) return ''
  const [hours, minutes] = value.split(':')
  if (!hours || !minutes) return value
  const date = new Date()
  date.setHours(Number(hours), Number(minutes), 0, 0)
  return date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function SchoolTrips() {
  const { t, dir, language } = useLanguage()
  const locale = language === 'ar' ? 'ar-SA' : 'en-US'
  const [trips, setTrips] = useState(initialTrips)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [permitKey, setPermitKey] = useState(0)
  const [selectedReportId, setSelectedReportId] = useState(() => {
    const readyReport = initialTrips.find(
      (trip) => trip.status === 'past' && trip.reportReady
    )
    return readyReport ? readyReport.id : ''
  })

  const upcomingTrips = useMemo(
    () => trips.filter((trip) => trip.status === 'upcoming'),
    [trips]
  )

  const pastTrips = useMemo(
    () => trips.filter((trip) => trip.status === 'past'),
    [trips]
  )

  const reportTrips = useMemo(
    () => pastTrips.filter((trip) => trip.reportReady && trip.report),
    [pastTrips]
  )

  useEffect(() => {
    if (!reportTrips.length) {
      if (selectedReportId) {
        setSelectedReportId('')
      }
      return
    }

    if (!selectedReportId || !reportTrips.some((trip) => trip.id === selectedReportId)) {
      setSelectedReportId(reportTrips[0].id)
    }
  }, [reportTrips, selectedReportId])

  const stats = useMemo(() => {
    const upcomingStudents = upcomingTrips.reduce(
      (sum, trip) => sum + (Number(trip.studentsCount) || 0),
      0
    )

    return {
      upcoming: upcomingTrips.length,
      past: pastTrips.length,
      students: upcomingStudents,
      reportsReady: reportTrips.length,
    }
  }, [upcomingTrips, pastTrips, reportTrips])

  const handleCreate = () => {
    setMessage('')

    const requiredFields = [
      'title',
      'destination',
      'date',
      'time',
      'grade',
      'studentsCount',
      'supervisorsCount',
    ]

    const missing = requiredFields.filter((field) => !form[field])

    if (missing.length) {
      setMessage(t('schoolTrips.form.messages.missingRequired'))
      return
    }

    const agendaItems = form.agenda
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)

    const newTrip = {
      id: `st-${Date.now()}`,
      title: form.title.trim(),
      destination: form.destination.trim(),
      date: formatDateLabel(form.date, locale),
      time: formatTimeLabel(form.time, locale),
      grade: form.grade,
      studentsCount: Number(form.studentsCount) || 0,
      supervisorsCount: Number(form.supervisorsCount) || 0,
      focus: form.focus.trim() || t('schoolTrips.defaults.focus'),
      meetingPoint: form.meetingPoint.trim() || t('schoolTrips.defaults.meetingPoint'),
      transport: form.transport || t('schoolTrips.defaults.transport'),
      readiness: 12,
      status: 'upcoming',
      agenda: agendaItems,
      reportReady: false,
      notes: form.notes.trim(),
      permitFileName: form.permitFileName,
    }

    setTrips((prev) => [newTrip, ...prev])
    setForm(emptyForm)
    setPermitKey((prev) => prev + 1)
    setActiveTab('upcoming')
    setMessage(t('schoolTrips.form.messages.created'))
  }

  const handleReset = () => {
    setForm(emptyForm)
    setPermitKey((prev) => prev + 1)
    setMessage(t('schoolTrips.form.messages.cleared'))
  }

  return (
    <div className="home schoolTripsPage" dir={dir}>
      <Header />

      <main className="schoolTripsMain">
        <SchoolTripsHero stats={stats} />

        <SchoolTripsForm
          form={form}
          setForm={setForm}
          onCreate={handleCreate}
          onReset={handleReset}
          message={message}
          permitKey={permitKey}
        />

        <SchoolTripsTimeline
          upcomingTrips={upcomingTrips}
          pastTrips={pastTrips}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <SchoolTripsReport
          reports={reportTrips}
          selectedId={selectedReportId}
          onSelect={setSelectedReportId}
        />
      </main>

      <Footer />
    </div>
  )
}

export default SchoolTrips
