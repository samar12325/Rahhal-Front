import { useMemo } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import {
  localizeApprovalStatus,
  localizeSchoolTripGrade,
  localizeSchoolTripMeetingPoint,
  localizeSchoolTripName,
  localizeSchoolTripSchool,
  localizeSchoolTripTitle,
  localizeSchoolTripTransport,
} from './schoolTripsLocale'

const formatDate = (value, locale) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

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

function SchoolTripsReport({
  trips,
  selectedId,
  onSelect,
  report,
  loading,
  error,
}) {
  const { t, language } = useLanguage()
  const locale = language === 'ar' ? 'ar-SA' : 'en-US'
  const selectedTrip = useMemo(
    () => trips.find((trip) => trip.id === selectedId) || trips[0] || null,
    [trips, selectedId],
  )

  const trip = report?.trip ?? null
  const students = Array.isArray(report?.students) ? report.students : []
  const summary = report?.summary ?? {
    totalStudents: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  }

  const tripDate =
    trip?.startDate && trip?.endDate && trip.startDate !== trip.endDate
      ? `${formatDate(trip.startDate, locale)} - ${formatDate(trip.endDate, locale)}`
      : formatDate(trip?.startDate ?? trip?.endDate, locale)

  const destinationName = localizeSchoolTripName(language, trip?.destinationName)
  const placeName = localizeSchoolTripName(language, trip?.placeName)
  const educationLevel = localizeSchoolTripGrade(language, trip?.educationLevel, t)
  const transportType = localizeSchoolTripTransport(language, trip?.transportType, t)
  const tripTitle = localizeSchoolTripTitle(language, trip?.title)
  const schoolName = localizeSchoolTripSchool(language, trip?.schoolName)
  const meetingPoint = localizeSchoolTripMeetingPoint(language, trip?.meetingPoint)

  const handlePrint = () => {
    window.print()
  }

  const text = {
    loading: language === 'ar' ? 'جاري تحميل التقرير...' : 'Loading report...',
    noData:
      language === 'ar'
        ? 'لا توجد بيانات تقرير لهذه الرحلة حالياً.'
        : 'No report data is available for this trip yet.',
    tripInfo: language === 'ar' ? 'بيانات الرحلة' : 'Trip details',
    logistics: language === 'ar' ? 'التجهيزات' : 'Logistics',
    summary: language === 'ar' ? 'ملخص الحالات' : 'Approval summary',
    summaryHint:
      language === 'ar'
        ? 'إجمالي عدد الطلاب وحالات موافقات أولياء الأمور لهذه الرحلة.'
        : 'Total students and parent approval statuses for this trip.',
    labels: {
      destination: language === 'ar' ? 'الوجهة' : 'Destination',
      place: language === 'ar' ? 'المكان' : 'Place',
      date: language === 'ar' ? 'التاريخ' : 'Date',
      tripName: language === 'ar' ? 'اسم الرحلة' : 'Trip name',
      school: language === 'ar' ? 'المدرسة' : 'School',
      educationLevel: language === 'ar' ? 'المرحلة الدراسية' : 'Grade level',
      studentsCount: language === 'ar' ? 'عدد الطلاب' : 'Students',
      supervisorsCount: language === 'ar' ? 'عدد المشرفين' : 'Supervisors',
      transportType: language === 'ar' ? 'وسيلة النقل' : 'Transport',
      meetingPoint: language === 'ar' ? 'نقطة التجمع' : 'Meeting point',
      notes: language === 'ar' ? 'الملاحظات' : 'Notes',
      totalStudents: language === 'ar' ? 'إجمالي الطلاب' : 'Total students',
      approvedCount: language === 'ar' ? 'عدد الموافقين' : 'Approved',
      pendingCount: language === 'ar' ? 'عدد المنتظرين' : 'Pending',
      rejectedCount: language === 'ar' ? 'عدد الرافضين' : 'Rejected',
      studentName: language === 'ar' ? 'اسم الطالب' : 'Student name',
      parentName: language === 'ar' ? 'اسم ولي الأمر' : 'Parent name',
      parentPhone: language === 'ar' ? 'جوال ولي الأمر' : 'Parent phone',
      parentEmail: language === 'ar' ? 'إيميل ولي الأمر' : 'Parent email',
      approvalStatus: language === 'ar' ? 'حالة الموافقة' : 'Approval status',
      approvedAt: language === 'ar' ? 'تاريخ الموافقة' : 'Approved at',
    },
    noStudents:
      language === 'ar'
        ? 'لا توجد أسماء طلاب مسجلة لهذه الرحلة.'
        : 'No students are listed for this trip.',
    downloadPdf: language === 'ar' ? 'تحميل التقرير PDF' : 'Download PDF report',
  }

  return (
    <section className="schoolCard schoolTripsReport" id="trip-report">
      <div className="schoolTripsReportHead">
        <div>
          <h2>{t('schoolTrips.report.title')}</h2>
          <p>{t('schoolTrips.report.subtitle')}</p>
        </div>
        {trips.length ? (
          <div className="schoolTripsReportSelect">
            <label className="schoolTripsLabel" htmlFor="report-trip">
              {t('schoolTrips.report.selectLabel')}
            </label>
            <select
              id="report-trip"
              className="schoolSelect"
              value={selectedTrip?.id ?? ''}
              onChange={(event) => onSelect(event.target.value)}
            >
              {trips.map((tripOption) => (
                <option key={tripOption.id} value={tripOption.id}>
                  {localizeSchoolTripTitle(language, tripOption.title)}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {!trips.length ? (
        <div className="schoolReportEmpty">{t('schoolTrips.report.empty')}</div>
      ) : loading ? (
        <div className="schoolReportEmpty">{text.loading}</div>
      ) : error ? (
        <div className="schoolReportEmpty">{error}</div>
      ) : !trip ? (
        <div className="schoolReportEmpty">{text.noData}</div>
      ) : (
        <div className="schoolTripsReportBody">
          <div className="schoolReportSummary">
            <div className="schoolReportSummaryHead">
              <div>
                <h3>{tripTitle || '-'}</h3>
                <p>{schoolName || '-'}</p>
              </div>
              <span className="schoolReportBadge">{t('schoolTrips.report.badge')}</span>
            </div>
            <div className="schoolReportMeta">
              <span>
                {text.labels.destination}: {destinationName || '-'}
              </span>
              <span>
                {text.labels.place}: {placeName || '-'}
              </span>
              <span>
                {text.labels.date}: {tripDate}
              </span>
            </div>
          </div>

          <div className="schoolReportGrid">
            <div className="schoolReportCard">
              <h4>{text.tripInfo}</h4>
              <ul className="schoolReportList">
                <li>{text.labels.tripName}: {tripTitle || '-'}</li>
                <li>{text.labels.school}: {schoolName || '-'}</li>
                <li>{text.labels.educationLevel}: {educationLevel || '-'}</li>
                <li>{text.labels.destination}: {destinationName || '-'}</li>
                <li>{text.labels.place}: {placeName || '-'}</li>
                <li>{text.labels.date}: {tripDate}</li>
              </ul>
            </div>

            <div className="schoolReportCard">
              <h4>{text.logistics}</h4>
              <ul className="schoolReportList">
                <li>{text.labels.studentsCount}: {trip.studentsCount}</li>
                <li>{text.labels.supervisorsCount}: {trip.supervisorsCount}</li>
                <li>{text.labels.transportType}: {transportType || '-'}</li>
                <li>{text.labels.meetingPoint}: {meetingPoint || '-'}</li>
                <li>{text.labels.notes}: {trip.notes || '-'}</li>
              </ul>
            </div>
          </div>

          <div className="schoolReportSummary">
            <div className="schoolReportSummaryHead">
              <div>
                <h3>{text.summary}</h3>
                <p>{text.summaryHint}</p>
              </div>
            </div>

            <div className="schoolReportGrid schoolReportSummaryGrid">
              <div className="schoolReportCard">
                <h4>{text.labels.totalStudents}</h4>
                <strong>{summary.totalStudents}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.labels.approvedCount}</h4>
                <strong>{summary.approvedCount}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.labels.pendingCount}</h4>
                <strong>{summary.pendingCount}</strong>
              </div>
              <div className="schoolReportCard">
                <h4>{text.labels.rejectedCount}</h4>
                <strong>{summary.rejectedCount}</strong>
              </div>
            </div>
          </div>

          <div className="schoolApprovalTableWrap">
            {students.length ? (
              <table className="schoolApprovalTable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{text.labels.studentName}</th>
                    <th>{text.labels.parentName}</th>
                    <th>{text.labels.parentPhone}</th>
                    <th>{text.labels.parentEmail}</th>
                    <th>{text.labels.approvalStatus}</th>
                    <th>{text.labels.approvedAt}</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={`${student.studentName}-${student.parentPhone}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{student.studentName}</td>
                      <td>{student.parentName}</td>
                      <td>{student.parentPhone}</td>
                      <td>{student.parentEmail}</td>
                      <td>
                        <span className={`approvalStatusBadge ${student.approvalStatus}`}>
                          {localizeApprovalStatus(language, student.approvalStatus) || student.approvalStatus}
                        </span>
                      </td>
                      <td>{formatDateTime(student.approvedAt, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="schoolApprovalEmpty">{text.noStudents}</div>
            )}
          </div>

          <div className="schoolReportActions">
            <button className="primaryBtn" type="button" onClick={handlePrint}>
              {text.downloadPdf}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default SchoolTripsReport
