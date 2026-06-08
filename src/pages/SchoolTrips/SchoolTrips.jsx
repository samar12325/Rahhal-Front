import { useEffect, useMemo, useState } from 'react'
import '../Home/Home.css'
import './SchoolTrips.css'
import Header from '../Home/components/Header'
import Footer from '../Home/components/Footer'
import SchoolTripsHero from '../../components/schoolTrips/SchoolTripsHero'
import SchoolTripsForm from '../../components/schoolTrips/SchoolTripsForm'
import SchoolTripsTimeline from '../../components/schoolTrips/SchoolTripsTimeline'
import SchoolTripsReport from '../../components/schoolTrips/SchoolTripsReport'
import { useLanguage } from '../../i18n/LanguageContext'
import { apiRequest } from '../../api/client'

const emptyForm = {
  title: '',
  region: '',
  destinationId: '',
  placeId: '',
  schoolName: '',
  date: '',
  time: '',
  grade: '',
  hasBus: false,
  studentsCount: '',
  supervisorsCount: '',
  meetingPoint: '',
  permitFile: null,
  permitFileName: '',
}

const getTodayDateValue = () => new Date().toISOString().slice(0, 10)

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

const toUiTrip = (apiTrip, locale, time, permitFileName, t) => ({
  id: apiTrip.id,
  title: apiTrip.title,
  destination:
    apiTrip.school_details?.place?.name ??
    apiTrip.destination?.name ??
    apiTrip.destination_id,
  date: formatDateLabel(apiTrip.start_date, locale),
  time: formatTimeLabel(time, locale),
  grade: apiTrip.school_details?.education_level ?? '',
  studentsCount: apiTrip.school_details?.students_count ?? 0,
  supervisorsCount: apiTrip.school_details?.supervisors_count ?? 0,
  meetingPoint:
    apiTrip.school_details?.meeting_point?.trim() ||
    t('schoolTrips.defaults.meetingPoint'),
  transport: apiTrip.school_details?.transport_type || t('schoolTrips.defaults.transport'),
  readiness: apiTrip.school_details?.prep_progress ?? 12,
  isReady: apiTrip.school_details?.is_ready ?? false,
  status: 'upcoming',
  reportReady: false,
  permitFileName,
})

function SchoolTrips() {
  const { t, dir, language } = useLanguage()
  const locale = language === 'ar' ? 'ar-SA' : 'en-US'
  const [trips, setTrips] = useState([])
  const [message, setMessage] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [permitKey, setPermitKey] = useState(0)
  const [regions, setRegions] = useState([])
  const [cities, setCities] = useState([])
  const [places, setPlaces] = useState([])
  const [regionsLoading, setRegionsLoading] = useState(false)
  const [citiesLoading, setCitiesLoading] = useState(false)
  const [placesLoading, setPlacesLoading] = useState(false)
  const [statsData, setStatsData] = useState(null)
  const [activeTripTab, setActiveTripTab] = useState('current')
  const [selectedReportId, setSelectedReportId] = useState('')
  const [reportData, setReportData] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [reportError, setReportError] = useState('')
  const [approvalTripId, setApprovalTripId] = useState('')
  const [reportRefreshKey, setReportRefreshKey] = useState(0)

  const upcomingTrips = useMemo(
    () => trips.filter((trip) => trip.status === 'upcoming'),
    [trips]
  )

  const pastTrips = useMemo(
    () => trips.filter((trip) => trip.status === 'past'),
    [trips]
  )

  const reportTrips = useMemo(
    () => trips,
    [trips]
  )

  useEffect(() => {
    if (!reportTrips.length) {
      if (selectedReportId) {
        setSelectedReportId('')
      }
      if (approvalTripId) {
        setApprovalTripId('')
      }
      return
    }

    if (!selectedReportId || !reportTrips.some((trip) => trip.id === selectedReportId)) {
      setSelectedReportId(reportTrips[0].id)
    }
  }, [approvalTripId, reportTrips, selectedReportId])

  useEffect(() => {
    let isMounted = true

    if (!selectedReportId) {
      setReportData(null)
      setReportError('')
      setReportLoading(false)
      return () => {
        isMounted = false
      }
    }

    const loadReport = async () => {
      setReportLoading(true)
      setReportError('')
      try {
        const data = await apiRequest(`/api/school-trips/${selectedReportId}/report`)
        if (isMounted) setReportData(data)
      } catch (error) {
        if (isMounted) {
          setReportData(null)
          setReportError(
            error?.message ||
              t('schoolTrips.form.messages.requestFailed', {
                fallback: 'تعذر تحميل تقرير الرحلة.',
              }),
          )
        }
      } finally {
        if (isMounted) setReportLoading(false)
      }
    }

    loadReport()
    return () => {
      isMounted = false
    }
  }, [selectedReportId, reportRefreshKey, t])

  useEffect(() => {
    let isMounted = true
    const loadRegions = async () => {
      setRegionsLoading(true)
      try {
        const data = await apiRequest('/api/school-trips/regions')
        if (isMounted) setRegions(Array.isArray(data) ? data : [])
      } catch {
        if (isMounted) setRegions([])
      } finally {
        if (isMounted) setRegionsLoading(false)
      }
    }

    loadRegions()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    if (!form.region) {
      setCities([])
      return () => {
        isMounted = false
      }
    }

    const loadCities = async () => {
      setCitiesLoading(true)
      try {
        const data = await apiRequest(
          `/api/school-trips/cities?region=${encodeURIComponent(form.region)}`,
        )
        if (isMounted) setCities(Array.isArray(data) ? data : [])
      } catch {
        if (isMounted) setCities([])
      } finally {
        if (isMounted) setCitiesLoading(false)
      }
    }

    loadCities()
    return () => {
      isMounted = false
    }
  }, [form.region])

  useEffect(() => {
    let isMounted = true

    if (!form.destinationId) {
      setPlaces([])
      return () => {
        isMounted = false
      }
    }

    const loadPlaces = async () => {
      setPlacesLoading(true)
      try {
        const data = await apiRequest(
          `/api/school-trips/places?destinationId=${encodeURIComponent(form.destinationId)}`,
        )
        if (isMounted) setPlaces(Array.isArray(data) ? data : [])
      } catch {
        if (isMounted) setPlaces([])
      } finally {
        if (isMounted) setPlacesLoading(false)
      }
    }

    loadPlaces()
    return () => {
      isMounted = false
    }
  }, [form.destinationId])

  useEffect(() => {
    let isMounted = true
    const loadTrips = async () => {
      try {
        const data = await apiRequest('/api/school-trips')
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const mapped = (Array.isArray(data?.trips) ? data.trips : []).map(
          (apiTrip) => {
            const end = apiTrip.end_date ? new Date(apiTrip.end_date) : null
            const isPast = end ? end < today : false
            const approval =
              apiTrip.status === 'open' ||
              apiTrip.status === 'full' ||
              apiTrip.status === 'completed'
                ? 'approved'
                : apiTrip.status === 'cancelled'
                  ? 'rejected'
                  : 'pending'

            return {
              ...toUiTrip(apiTrip, locale, '', apiTrip.permitFileName ?? '', t),
              status: isPast ? 'past' : 'upcoming',
              approval,
              dbStatus: apiTrip.status,
              reportReady: apiTrip.status === 'completed',
            }
          },
        )

        if (isMounted) setTrips(mapped)
      } catch {
        if (isMounted) setTrips([])
      }
    }

    loadTrips()
    return () => {
      isMounted = false
    }
  }, [locale, t])

  useEffect(() => {
    let isMounted = true
    const loadStats = async () => {
      try {
        const data = await apiRequest('/api/school-trips/stats')
        if (isMounted) setStatsData(data)
      } catch {
        if (isMounted) setStatsData(null)
      }
    }

    loadStats()
    return () => {
      isMounted = false
    }
  }, [])

  const computedStats = useMemo(() => {
    const upcomingStudents = upcomingTrips.reduce(
      (sum, trip) => sum + (Number(trip.studentsCount) || 0),
      0
    )
    const readyReportsCount = trips.filter((trip) => trip.reportReady).length

    return {
      upcoming: upcomingTrips.length,
      past: pastTrips.length,
      students: upcomingStudents,
      reportsReady: readyReportsCount,
    }
  }, [upcomingTrips, pastTrips, trips])

  const stats = statsData
    ? {
        upcoming: statsData.upcomingTrips ?? 0,
        past: statsData.pastTrips ?? 0,
        students: statsData.upcomingStudents ?? 0,
        reportsReady: statsData.readyReports ?? 0,
      }
    : computedStats

  const handleCreate = async () => {
    setMessage('')
    const todayDate = getTodayDateValue()

    const requiredFields = [
      'title',
      'schoolName',
      'region',
      'destinationId',
      'placeId',
      'date',
      'time',
      'grade',
      'studentsCount',
      'supervisorsCount',
      'meetingPoint',
    ]

    const missing = requiredFields.filter((field) => !form[field])

    if (missing.length) {
      setMessage(t('schoolTrips.form.messages.missingRequired'))
      return
    }

    if (form.date < todayDate) {
      setMessage(t('schoolTrips.form.messages.pastDateNotAllowed'))
      return
    }

    try {
      const fd = new FormData()
      fd.append('title', form.title.trim())
      fd.append('destination_id', form.destinationId)
      fd.append('place_id', form.placeId)
      fd.append('start_date', form.date)
      fd.append('end_date', form.date)
      fd.append('duration_days', '1')
      fd.append(
        'max_participants',
        String(Number(form.studentsCount) + Number(form.supervisorsCount)),
      )
      fd.append('school_name', form.schoolName.trim())
      fd.append('education_level', form.grade)
      fd.append('students_count', String(form.studentsCount))
      fd.append('supervisors_count', String(form.supervisorsCount))
      fd.append('transport_type', form.hasBus ? 'bus' : 'no_bus')
      fd.append('meeting_point', form.meetingPoint.trim())
      if (form.permitFile) fd.append('permitFile', form.permitFile)

      const createdTrip = await apiRequest('/api/school-trips', {
        method: 'POST',
        body: fd,
      })

      const newTrip = toUiTrip(
        createdTrip,
        locale,
        form.time,
        form.permitFileName,
        t,
      )

      const end = createdTrip.end_date ? new Date(createdTrip.end_date) : null
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const isPast = end ? end < today : false
      const approval =
        createdTrip.status === 'open' ||
        createdTrip.status === 'full' ||
        createdTrip.status === 'completed'
          ? 'approved'
          : createdTrip.status === 'cancelled'
            ? 'rejected'
            : 'pending'

      setTrips((prev) => [
        {
          ...newTrip,
          status: isPast ? 'past' : 'upcoming',
          approval,
          dbStatus: createdTrip.status,
          reportReady: createdTrip.status === 'completed',
        },
        ...prev,
      ])
      setApprovalTripId(createdTrip.id)
      setSelectedReportId(createdTrip.id)
      setForm(emptyForm)
      setPermitKey((prev) => prev + 1)
      setMessage(t('schoolTrips.form.messages.created'))
    } catch (error) {
      setMessage(error?.message || t('schoolTrips.form.messages.requestFailed'))
    }
  }

  const handleReset = () => {
    setForm(emptyForm)
    setPermitKey((prev) => prev + 1)
    setMessage(t('schoolTrips.form.messages.cleared'))
  }

  const handleRegionChange = (region) => {
    setCities([])
    setPlaces([])
    setForm((prev) => ({
      ...prev,
      region,
      destinationId: '',
      placeId: '',
    }))
  }

  const handleCityChange = (destinationId) => {
    setPlaces([])
    setForm((prev) => ({
      ...prev,
      destinationId,
      placeId: '',
    }))
  }

  const scrollToReport = () => {
    if (typeof document === 'undefined') return
    document.getElementById('trip-report')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const handleViewReport = (tripId) => {
    setSelectedReportId(tripId)
    scrollToReport()
  }

  const handleDownloadSummary = (tripId) => {
    setSelectedReportId(tripId)
    scrollToReport()
    window.setTimeout(() => {
      window.print()
    }, 250)
  }

  const handleSelectReportTrip = (tripId) => {
    setSelectedReportId(tripId)
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
          approvalTripId={approvalTripId}
          onApprovalsChanged={() => setReportRefreshKey((prev) => prev + 1)}
          permitKey={permitKey}
          regions={regions}
          cities={cities}
          places={places}
          regionsLoading={regionsLoading}
          citiesLoading={citiesLoading}
          placesLoading={placesLoading}
          onRegionChange={handleRegionChange}
          onCityChange={handleCityChange}
        />

        <SchoolTripsTimeline
          activeTripTab={activeTripTab}
          onTabChange={setActiveTripTab}
          currentTrips={upcomingTrips}
          pastTrips={pastTrips}
          onViewReport={handleViewReport}
          onDownloadSummary={handleDownloadSummary}
          onApprovalsChanged={() => setReportRefreshKey((prev) => prev + 1)}
        />

        <SchoolTripsReport
          trips={reportTrips}
          selectedId={selectedReportId}
          onSelect={handleSelectReportTrip}
          report={reportData}
          loading={reportLoading}
          error={reportError}
        />
      </main>

      <Footer />
    </div>
  )
}

export default SchoolTrips
