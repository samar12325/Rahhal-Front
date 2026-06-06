import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import '../Home/Home.css'
import Header from '../Home/components/Header'
import Footer from '../Home/components/Footer'
import './BookingDateSelection.css'
import { loadTrips } from '../../data/trips.store'

const timeSlots = [
  { value: '08:30', label: 'صباح هادئ', hint: 'إقلاع مع الشروق' },
  { value: '11:00', label: 'منتصف اليوم', hint: 'نشاط وتجارب' },
  { value: '15:30', label: 'عصر مريح', hint: 'أجواء معتدلة' },
  { value: '19:00', label: 'مساء فاخر', hint: 'أضواء المدينة' },
]

const weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

const formatPreviewDate = (value) => {
  if (!value) return 'اختر تاريخاً'
  try {
    return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'full' }).format(new Date(value))
  } catch {
    return value
  }
}

const formatPreviewTime = (value) => {
  if (!value) return 'اختر وقتاً'
  try {
    const [hours = '0', minutes = '0'] = value.split(':')
    const preview = new Date()
    preview.setHours(Number(hours), Number(minutes), 0, 0)
    return new Intl.DateTimeFormat('ar-SA', { hour: 'numeric', minute: 'numeric' }).format(preview)
  } catch {
    return value
  }
}

const formatPeopleLabel = (value) => {
  const count = Number(value || 1)
  if (count <= 1) return 'شخص واحد'
  if (count === 2) return 'شخصان'
  return `${count} أشخاص`
}

function BookingDateSelection() {
  const [trips] = useState(() => loadTrips())
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialDate = searchParams.get('date') || ''
  const initialTime = searchParams.get('time') || ''
  const initialPeople = searchParams.get('people') || '1'

  const [values, setValues] = useState(() => ({
    date: initialDate,
    time: initialTime,
    people: initialPeople,
  }))
  const [isTouched, setIsTouched] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const base = initialDate ? new Date(initialDate) : new Date()
    base.setDate(1)
    base.setHours(0, 0, 0, 0)
    return base
  })

  const tripId = searchParams.get('tripId')
  const destinationId = searchParams.get('destinationId')
  const activityId = searchParams.get('activityId')

  const trip = useMemo(() => trips.find((item) => item.id === tripId), [trips, tripId])

  const today = useMemo(() => {
    const current = new Date()
    current.setHours(0, 0, 0, 0)
    return current
  }, [])

  const firstAvailableMonth = useMemo(() => {
    const start = new Date(today)
    start.setDate(1)
    return start
  }, [today])

  const lastAvailableMonth = useMemo(() => {
    const end = new Date(today)
    end.setDate(1)
    end.setMonth(end.getMonth() + 5)
    return end
  }, [today])

  const lastAvailableDay = useMemo(() => {
    const end = new Date(lastAvailableMonth)
    end.setMonth(end.getMonth() + 1, 0)
    end.setHours(0, 0, 0, 0)
    return end
  }, [lastAvailableMonth])

  const calendarLabel = useMemo(
    () => new Intl.DateTimeFormat('ar-SA', { month: 'long', year: 'numeric' }).format(calendarMonth),
    [calendarMonth]
  )

  const calendarDays = useMemo(() => {
    const start = new Date(calendarMonth)
    const startDay = start.getDay()
    const gridStart = new Date(start)
    gridStart.setDate(1 - startDay)
    gridStart.setHours(0, 0, 0, 0)

    const days = []
    const cursor = new Date(gridStart)

    for (let i = 0; i < 42; i += 1) {
      const iso = cursor.toISOString().split('T')[0]
      const isCurrentMonth = cursor.getMonth() === calendarMonth.getMonth()
      const isBeforeToday = cursor < today
      const isBeyondMax = cursor > lastAvailableDay
      days.push({
        iso,
        label: cursor.getDate(),
        isCurrentMonth,
        isDisabled: !isCurrentMonth || isBeforeToday || isBeyondMax,
      })
      cursor.setDate(cursor.getDate() + 1)
    }

    return days
  }, [calendarMonth, today, lastAvailableDay])

  const canGoPrev = calendarMonth > firstAvailableMonth
  const canGoNext = calendarMonth < lastAvailableMonth

  const canContinue = Boolean(trip && values.date && values.time)

  const handleDateSelect = (day) => {
    if (day.isDisabled) return
    setIsTouched(false)
    setValues((prev) => ({ ...prev, date: day.iso }))
  }

  const handleMonthChange = (direction) => {
    setCalendarMonth((prev) => {
      const next = new Date(prev)
      next.setMonth(prev.getMonth() + direction, 1)
      next.setHours(0, 0, 0, 0)

      if (direction < 0 && next < firstAvailableMonth) return prev
      if (direction > 0 && next > lastAvailableMonth) return prev
      return next
    })
  }

  const handleSlotSelect = (slot) => {
    setIsTouched(false)
    setValues((prev) => ({
      ...prev,
      time: prev.time === slot.value ? '' : slot.value,
    }))
  }

  const handlePeopleAdjust = (delta) => {
    setValues((prev) => {
      const current = Number(prev.people || 1)
      const next = Math.min(20, Math.max(1, current + delta))
      return { ...prev, people: String(next) }
    })
  }

  const handlePeopleInput = (event) => {
    const { value } = event.target
    if (!value) {
      setValues((prev) => ({ ...prev, people: '' }))
      return
    }

    const numberValue = Number(value)
    if (Number.isNaN(numberValue)) return
    const sanitized = Math.min(20, Math.max(1, numberValue))
    setValues((prev) => ({ ...prev, people: String(sanitized) }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsTouched(true)

    if (!canContinue) return

    const params = new URLSearchParams()

    if (destinationId) params.set('destinationId', destinationId)
    if (activityId) params.set('activityId', activityId)
    if (tripId) params.set('tripId', tripId)

    params.set('date', values.date)
    params.set('time', values.time)
    params.set('people', values.people || '1')

    navigate(`/checkout?${params.toString()}`)
  }

  return (
    <div className="home bookingPage" dir="rtl">
      <Header />
      <main className="bookingMain">
        <div className="bookingIntro">
          <p className="bookingEyebrow">اختيار موعد الرحلة</p>
          <h1>جهّز رحلتك بتسلسل خفيف وواضح</h1>
          <p className="bookingSubtitle">
            اختر التاريخ، الوقت وعدد المرافقين عبر تجربة تفاعلية تشعرك بأنك تخطط لرحلة خاصة بك.
          </p>
        </div>

        <div className="bookingLayout">
          <section className="bookingCard bookingFormCard">
            {trip ? (
              <div className="bookingTripInfo">
                <div>
                  <p className="bookingTripTitle">{trip.title}</p>
                  <p className="bookingTripCity">{trip.city}</p>
                </div>
                <span className="bookingTripPrice">{trip.price} ر.س</span>
              </div>
            ) : (
              <div className="bookingEmpty">
                <p>لم يتم العثور على الرحلة المطلوبة.</p>
                <Link className="secondaryBtn" to="/events">
                  العودة للرحلات
                </Link>
              </div>
            )}

            <form className="bookingForm" onSubmit={handleSubmit}>
              <div className="bookingSteps">
                <div className="bookingStep calendarStep">
                  <div className="bookingStepHeader">
                    <span className="bookingStepIndex">1</span>
                    <div>
                      <p className="bookingStepTitle">اختر اليوم</p>
                      <p className="bookingStepHint">الأيام المتاحة أمامك بوضوح</p>
                    </div>
                  </div>

                  <div className="bookingCalendar">
                    <div className="calendarHeader">
                      <button
                        className="calendarNavBtn"
                        type="button"
                        onClick={() => handleMonthChange(-1)}
                        disabled={!canGoPrev}
                        aria-label="الشهر السابق"
                      >
                        ‹
                      </button>
                      <p className="calendarLabel">{calendarLabel}</p>
                      <button
                        className="calendarNavBtn"
                        type="button"
                        onClick={() => handleMonthChange(1)}
                        disabled={!canGoNext}
                        aria-label="الشهر التالي"
                      >
                        ›
                      </button>
                    </div>
                    <div className="calendarWeekdays">
                      {weekDays.map((day) => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>
                    <div className="calendarGrid">
                      {calendarDays.map((day) => {
                        const isSelected = values.date === day.iso
                        const className = [
                          'calendarDay',
                          day.isDisabled ? 'disabled' : '',
                          isSelected ? 'selected' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')

                        return (
                          <button
                            key={day.iso}
                            type="button"
                            className={className}
                            onClick={() => handleDateSelect(day)}
                            disabled={day.isDisabled}
                          >
                            {day.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="bookingStep timeStep">
                  <div className="bookingStepHeader">
                    <span className="bookingStepIndex">2</span>
                    <div>
                      <p className="bookingStepTitle">اختر الوقت</p>
                      <p className="bookingStepHint">فترة واحدة مميزة لكل رحلة</p>
                    </div>
                  </div>

                  <div className="bookingChips" role="list">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        className={`bookingChip ${values.time === slot.value ? 'active' : ''}`}
                        onClick={() => handleSlotSelect(slot)}
                      >
                        <span className="bookingChipLabel">{slot.label}</span>
                        <span className="bookingChipHint">{slot.hint}</span>
                        <span className="bookingChipTime">{formatPreviewTime(slot.value)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bookingStep peopleStep">
                  <div className="bookingStepHeader">
                    <span className="bookingStepIndex">3</span>
                    <div>
                      <p className="bookingStepTitle">عدد المسافرين</p>
                      <p className="bookingStepHint">لموازنة الطاقم والخدمة</p>
                    </div>
                  </div>

                  <div className="bookingPeopleControl">
                    <button
                      className="peopleBtn"
                      type="button"
                      onClick={() => handlePeopleAdjust(-1)}
                      aria-label="تقليل العدد"
                    >
                      -
                    </button>
                    <input
                      className="peopleInput"
                      type="number"
                      min="1"
                      max="20"
                      value={values.people}
                      onChange={handlePeopleInput}
                      aria-label="عدد الأشخاص"
                    />
                    <button
                      className="peopleBtn"
                      type="button"
                      onClick={() => handlePeopleAdjust(1)}
                      aria-label="زيادة العدد"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {isTouched && !canContinue ? (
                <p className="bookingError">الرجاء اختيار التاريخ والوقت قبل المتابعة.</p>
              ) : null}

              <button className="primaryBtn bookingSubmit" type="submit" disabled={!canContinue}>
                متابعة للدفع
              </button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default BookingDateSelection
