import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import '../Home/Home.css'
import '../AdminTrips/AdminTrips.css'
import './StatsPage.css'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'
import StatsEmptyState from './components/StatsEmptyState'

const TRIP_STATUS_COLORS = ['#9b7653', '#4fb3a6', '#e76f51', '#4f6f69']
const TRIP_TYPE_COLORS = ['#4fb3a6', '#9b7653']
const BOOKING_STATUS_COLORS = ['#4fb3a6', '#1d8f84', '#9b7653', '#e76f51']
const LINE_COLOR = '#9b7653'

const safeNumber = (value) => {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

const hasValues = (items = [], key = 'value') => items.some((item) => safeNumber(item?.[key]) > 0)

function StatsPage() {
  const { t, dir, language } = useLanguage()
  const [period, setPeriod] = useState('month')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const isMountedRef = useRef(true)

  const locale = language === 'ar' ? 'ar-SA' : 'en-US'

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale],
  )
  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [locale],
  )
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [locale],
  )

  const formatNumber = useCallback((value) => numberFormatter.format(safeNumber(value)), [numberFormatter])
  const formatPercent = useCallback((value) => percentFormatter.format(safeNumber(value)), [percentFormatter])
  const formatCurrency = useCallback(
    (value) => currencyFormatter.format(safeNumber(value)),
    [currencyFormatter],
  )

  const periods = useMemo(
    () => [
      { key: 'month', label: t('statsPage.periods.month') },
      { key: '6months', label: t('statsPage.periods.sixMonths') },
      { key: 'year', label: t('statsPage.periods.year') },
    ],
    [t],
  )

  const tripStatusLabels = useMemo(
    () => ({
      pending: t('statsPage.tripStatuses.pending'),
      approved: t('statsPage.tripStatuses.approved'),
      rejected: t('statsPage.tripStatuses.rejected'),
    }),
    [t],
  )

  const tripTypeLabels = useMemo(
    () => ({
      group: t('statsPage.tripTypes.group'),
      school: t('statsPage.tripTypes.school'),
    }),
    [t],
  )

  const bookingStatusLabels = useMemo(
    () => ({
      pending: t('statsPage.bookingStatuses.pending'),
      confirmed: t('statsPage.bookingStatuses.confirmed'),
      completed: t('statsPage.bookingStatuses.completed'),
      cancelled: t('statsPage.bookingStatuses.cancelled'),
    }),
    [t],
  )

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const fetchStats = useCallback(
    async (selectedPeriod) => {
      if (isMountedRef.current) {
        setLoading(true)
        setError(null)
      }

      try {
        const payload = await apiRequest(`/dashboard/trip-stats?range=${selectedPeriod}`)
        if (isMountedRef.current) {
          setStats(payload)
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError(err?.message || t('statsPage.errors.loadGeneric'))
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false)
        }
      }
    },
    [t],
  )

  useEffect(() => {
    fetchStats(period)
  }, [period, fetchStats])

  const createdTripsStats = stats?.createdTripsStats ?? {}
  const bookingStats = stats?.bookingStats ?? {}

  const createdTripsKpis = useMemo(
    () => [
      {
        label: t('statsPage.kpis.schoolTrips'),
        value: formatNumber(createdTripsStats?.schoolTripsCreatedCount),
      },
      {
        label: t('statsPage.kpis.groupTrips'),
        value: formatNumber(createdTripsStats?.groupTripsCreatedCount),
      },
      {
        label: t('statsPage.kpis.totalCreatedTrips'),
        value: formatNumber(createdTripsStats?.createdTripsCount),
      },
      {
        label: t('statsPage.kpis.pendingTrips'),
        value: formatNumber(createdTripsStats?.pendingTripsCount),
      },
      {
        label: t('statsPage.kpis.approvedTrips'),
        value: formatNumber(createdTripsStats?.approvedTripsCount),
      },
      {
        label: t('statsPage.kpis.rejectedTrips'),
        value: formatNumber(createdTripsStats?.rejectedTripsCount),
      },
    ],
    [createdTripsStats, formatNumber, t],
  )

  const bookingKpis = useMemo(
    () => [
      {
        label: t('statsPage.kpis.totalBookings'),
        value: formatNumber(bookingStats?.totalBookings),
      },
      {
        label: t('statsPage.kpis.totalRevenue'),
        value: formatCurrency(bookingStats?.totalRevenue),
      },
      {
        label: t('statsPage.kpis.completionRate'),
        value: `${formatPercent(bookingStats?.completionRate)}%`,
      },
    ],
    [bookingStats, formatCurrency, formatNumber, formatPercent, t],
  )

  const chartData = useMemo(
    () => ({
      tripStatuses:
        stats?.tripStatusDistribution
          ?.filter((item) => item.status !== 'completed')
          .map((item) => ({
            label: tripStatusLabels[item.status] ?? item.label,
            value: safeNumber(item.count),
          })) ?? [],
      tripTypes:
        stats?.tripTypeDistribution?.map((item) => ({
          label: tripTypeLabels[item.type] ?? item.label,
          value: safeNumber(item.count),
        })) ?? [],
      bookingStatuses:
        bookingStats?.bookingStatusDistribution?.map((item) => ({
          label: bookingStatusLabels[item.status] ?? item.label,
          value: safeNumber(item.count),
        })) ?? [],
      monthlyBookings:
        bookingStats?.monthlyTrend?.map((item) => ({
          month: item.ym,
          value: safeNumber(item.total),
        })) ?? [],
    }),
    [bookingStats, bookingStatusLabels, stats, tripStatusLabels, tripTypeLabels],
  )

  const createdTripsCount = safeNumber(createdTripsStats?.createdTripsCount)
  const totalBookings = safeNumber(bookingStats?.totalBookings)

  const shouldShowTripStatusChart =
    createdTripsCount > 0 && chartData.tripStatuses.length > 0 && hasValues(chartData.tripStatuses)
  const shouldShowTripTypeChart =
    createdTripsCount > 0 && chartData.tripTypes.length > 0 && hasValues(chartData.tripTypes)
  const shouldShowBookingStatusChart =
    totalBookings > 0 &&
    chartData.bookingStatuses.length > 0 &&
    hasValues(chartData.bookingStatuses)
  const shouldShowBookingTrendChart =
    totalBookings > 0 &&
    chartData.monthlyBookings.length > 0 &&
    hasValues(chartData.monthlyBookings)

  return (
    <div className="home statsPage" dir={dir}>
      <main className="statsMain">
        <section className="statsHero">
          <div className="statsHeroText">
            <p className="adminEyebrow">{t('statsPage.hero.eyebrow')}</p>
            <h1>{t('statsPage.hero.title')}</h1>
          </div>
          <div
            className="statsFilters"
            role="group"
            aria-label={t('statsPage.filters.periodAriaLabel')}
          >
            {periods.map((item) => (
              <button
                key={item.key}
                className={`filterChip ${period === item.key ? 'active' : ''}`}
                type="button"
                onClick={() => setPeriod(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {(loading || error) && (
          <div className={`statsStateMessage ${error ? 'error' : ''}`}>
            {loading && <p>{t('statsPage.states.loading')}</p>}
            {error && (
              <>
                <p>
                  {t('statsPage.states.errorPrefix')}: {error}
                </p>
                <button type="button" onClick={() => fetchStats(period)}>
                  {t('statsPage.actions.retry')}
                </button>
              </>
            )}
          </div>
        )}

        <section className="statsSection" aria-label={t('statsPage.sections.createdTrips')}>
          <div className="sectionHead">
            <h2 className="sectionTitle">{t('statsPage.sections.createdTrips')}</h2>
          </div>

          {createdTripsCount === 0 && !loading && !error ? (
            <StatsEmptyState title={t('statsPage.empty.createdTrips')} />
          ) : (
            <div className="statsKpiGrid statsKpiGridPrimary">
              {createdTripsKpis.map((kpi) => (
                <article className="statsKpiCard" key={kpi.label}>
                  <span>{kpi.label}</span>
                  <strong>{kpi.value}</strong>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="statsSection" aria-label={t('statsPage.sections.tripAnalysis')}>
          <div className="sectionHead">
            <h2 className="sectionTitle">{t('statsPage.sections.tripAnalysis')}</h2>
          </div>

          <div className="statsChartsGrid">
            <article className="chartCard">
              <h3>{t('statsPage.charts.tripStatuses')}</h3>
              <div className="chartCanvas">
                {shouldShowTripStatusChart ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.tripStatuses}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={55}
                        outerRadius={84}
                        paddingAngle={3}
                      >
                        {chartData.tripStatuses.map((entry, index) => (
                          <Cell key={entry.label} fill={TRIP_STATUS_COLORS[index % TRIP_STATUS_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <StatsEmptyState title={t('statsPage.empty.createdTrips')} />
                )}
              </div>
            </article>

            <article className="chartCard">
              <h3>{t('statsPage.charts.tripTypes')}</h3>
              <div className="chartCanvas">
                {shouldShowTripTypeChart ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.tripTypes} margin={{ left: 12, right: 12 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 61, 58, 0.12)" />
                      <XAxis dataKey="label" tick={{ fill: '#4f6f69', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#4f6f69', fontSize: 12 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                        {chartData.tripTypes.map((entry, index) => (
                          <Cell key={entry.label} fill={TRIP_TYPE_COLORS[index % TRIP_TYPE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <StatsEmptyState title={t('statsPage.empty.createdTrips')} />
                )}
              </div>
            </article>
          </div>
        </section>

        <section
          className="statsSection statsSecondarySection"
          aria-label={t('statsPage.sections.bookings')}
        >
          <div className="sectionHead">
            <h2 className="sectionTitle">{t('statsPage.sections.bookings')}</h2>
          </div>

          <div className="statsKpiGrid statsKpiGridCompact">
            {bookingKpis.map((kpi) => (
              <article className="statsKpiCard" key={kpi.label}>
                <span>{kpi.label}</span>
                <strong>{kpi.value}</strong>
              </article>
            ))}
          </div>

          <div className="statsChartsGrid">
            <article className="chartCard">
              <h3>{t('statsPage.charts.bookingStatuses')}</h3>
              <div className="chartCanvas">
                {shouldShowBookingStatusChart ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.bookingStatuses}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={55}
                        outerRadius={84}
                        paddingAngle={3}
                      >
                        {chartData.bookingStatuses.map((entry, index) => (
                          <Cell
                            key={entry.label}
                            fill={BOOKING_STATUS_COLORS[index % BOOKING_STATUS_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <StatsEmptyState title={t('statsPage.empty.bookings')} />
                )}
              </div>
            </article>

            <article className="chartCard">
              <h3>{t('statsPage.charts.bookingTrend')}</h3>
              <div className="chartCanvas">
                {shouldShowBookingTrendChart ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.monthlyBookings} margin={{ left: 12, right: 12 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 61, 58, 0.12)" />
                      <XAxis dataKey="month" tick={{ fill: '#4f6f69', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#4f6f69', fontSize: 12 }} allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke={LINE_COLOR} strokeWidth={3} dot />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <StatsEmptyState title={t('statsPage.empty.bookings')} />
                )}
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}

export default StatsPage
