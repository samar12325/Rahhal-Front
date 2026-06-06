import { useState } from 'react'
import '../Home/Home.css'
import './AiTrips.css'
import Header from '../Home/components/Header'
import Footer from '../Home/components/Footer'
import AiTripsHero from '../../components/aiTrips/AiTripsHero'
import AiTripForm from '../../components/aiTrips/AiTripForm'
import AiTripResult from '../../components/aiTrips/AiTripResult'
import AiTripsTabs from '../../components/aiTrips/AiTripsTabs'
import AiChatPanel from '../../components/aiTrips/AiChatPanel'
import { generatePlan } from '../../services/aiPlanner'
import { useLanguage } from '../../i18n/LanguageContext'

function AiTrips() {
  const { t, dir } = useLanguage()
  const [form, setForm] = useState({
    city: '',
    days: 3,
    minBudget: '',
    maxBudget: '',
    people: 2,
    style: 'all',
    prefs: [],
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState(null)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('plan')

  const onGenerate = async () => {
    setError('')
    setLoading(true)
    setPlan(null)

    try {
      const result = await generatePlan(form, { t })
      setPlan(result)
    } catch (err) {
      setError(t('aiTrips.errors.generate'))
    } finally {
      setLoading(false)
    }
  }

  const onExample = () => {
    setForm((prev) => ({
      ...prev,
      city: t('aiTrips.examples.city'),
      days: 3,
      minBudget: '300',
      maxBudget: '1500',
      style: 'culture',
      prefs: ['history', 'photography'],
      notes: '',
    }))
  }

  return (
    <div className="home aiTripsPage" dir={dir}>
      <Header />

      <main className="aiTripsMain">
        <AiTripsHero />

        <section className="aiTripsGrid">
          <AiTripForm
            form={form}
            setForm={setForm}
            onGenerate={onGenerate}
            onExample={onExample}
            loading={loading}
          />

          <div className="aiTripsPanel">
            <AiTripsTabs tab={tab} setTab={setTab} />
            {tab === 'plan' ? (
              <AiTripResult
                plan={plan}
                loading={loading}
                error={error}
                onRegenerate={onGenerate}
              />
            ) : (
              <AiChatPanel plan={plan} setPlan={setPlan} />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AiTrips
