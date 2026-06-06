import { useMemo, useState } from 'react'
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
import Footer from '../Home/components/Footer'
import { statsData } from '../../data/statsData'

const PERIODS = [
  { key: 'month', label: 'شهر' },
  { key: 'sixMonths', label: '6 شهور' },
  { key: 'year', label: 'سنة' },
]

const STATUS_COLORS = ['#4fb3a6', '#9b7653', '#e76f51']
const BAR_COLOR = '#4fb3a6'
const LINE_COLOR = '#9b7653'

function StatsPage() {
  const [period, setPeriod] = useState('month')

  const data = useMemo(() => statsData[period] ?? statsData.month, [period])

  return (
    <div className="home statsPage" dir="rtl">
      <main className="statsMain">
        <section className="statsHero">
          <div className="statsHeroText">
            <p className="adminEyebrow">لوحة الإدارة</p>
            <h1>إحصائيات الرحلات</h1>
            <p className="adminSubtitle">تتبّع الأداء، أعلى الوجهات، وترند الحجوزات.</p>
          </div>
          <div className="statsFilters" role="group" aria-label="تصفية الفترة الزمنية">
            {PERIODS.map((item) => (
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

        <section className="statsKpiGrid" aria-label="ملخص مؤشرات الأداء">
          {data.kpis.map((kpi) => (
            <article className="statsKpiCard" key={kpi.label}>
              <span>{kpi.label}</span>
              <strong>{kpi.value}</strong>
            </article>
          ))}
        </section>

        <section className="statsChartsGrid" aria-label="رسومات إحصائية">
          <article className="chartCard">
            <h3>توزيع حالات الحجز</h3>
            <div className="chartCanvas">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.bookingStatus}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {data.bookingStatus.map((entry, index) => (
                      <Cell key={entry.label} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="chartCard">
            <h3>أعلى الأماكن زيارة</h3>
            <div className="chartCanvas">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topPlaces} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 61, 58, 0.12)" />
                  <XAxis dataKey="label" tick={{ fill: '#4f6f69', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#4f6f69', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={BAR_COLOR} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="chartCard">
            <h3>توزيع أنواع الرحلات</h3>
            <div className="chartCanvas">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.tripTypes} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 61, 58, 0.12)" />
                  <XAxis dataKey="label" tick={{ fill: '#4f6f69', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#4f6f69', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={BAR_COLOR} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="chartCard wide">
            <h3>ترند الحجوزات الشهري</h3>
            <div className="chartCanvas">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyBookings} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 61, 58, 0.12)" />
                  <XAxis dataKey="month" tick={{ fill: '#4f6f69', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#4f6f69', fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke={LINE_COLOR} strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default StatsPage
