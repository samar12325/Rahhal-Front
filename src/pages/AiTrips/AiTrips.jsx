import { useEffect, useState } from 'react'
import '../Home/Home.css'
import './AiTrips.css'
import Header from '../Home/components/Header'
import Footer from '../Home/components/Footer'
import AiTripsHero from '../../components/aiTrips/AiTripsHero'
import AiTripForm from '../../components/aiTrips/AiTripForm'
import AiTripResult from '../../components/aiTrips/AiTripResult'
import AiTripsTabs from '../../components/aiTrips/AiTripsTabs'
import AiChatPanel from '../../components/aiTrips/AiChatPanel'
import AiTripHistory from '../../components/aiTrips/AiTripHistory'
import AiAssistantGuide from '../../components/aiTrips/AiAssistantGuide'
import { generatePlan } from '../../services/aiPlanner'
import { getAiTripSession, listAiTripSessions } from '../../services/aiTrips'
import { useLanguage } from '../../i18n/LanguageContext'

const createDefaultForm = () => ({
  city: '',
  days: 3,
  minBudget: '',
  maxBudget: '',
  people: 2,
  style: 'all',
  prefs: [],
  notes: '',
})

function AiTrips() {
  const { t, dir, language } = useLanguage()
  const [form, setForm] = useState(createDefaultForm)
  const [mode, setMode] = useState('assistant')
  const [loading, setLoading] = useState(false)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [plan, setPlan] = useState(null)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const [sessions, setSessions] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState('')
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [authRequired, setAuthRequired] = useState(false)

  const resetWorkspace = (nextMode) => {
    setCurrentSessionId(null)
    setMessages([])
    setError('')
    setPlan(null)
    if (nextMode === 'planner') {
      setForm(createDefaultForm())
    }
  }

  const applySession = (session) => {
    if (!session) return

    setCurrentSessionId(session.id)
    setMode(session.mode || 'planner')
    setMessages(
      Array.isArray(session.messages)
        ? session.messages.map((message) => ({
            id: message.id,
            role: message.role,
            text: message.text,
          }))
        : [],
    )

    if (session.mode === 'planner') {
      setForm((prev) => ({ ...prev, ...(session.form || {}) }))
      setPlan(session.plan || null)
    } else {
      setPlan(null)
    }
  }

  const refreshHistory = async () => {
    try {
      const payload = await listAiTripSessions()
      setSessions(Array.isArray(payload?.items) ? payload.items : [])
      setHistoryError('')
      setAuthRequired(false)
    } catch (err) {
      if (err?.status === 401) {
        setAuthRequired(true)
        setSessions([])
        return
      }

      setHistoryError(err?.message || t('aiTrips.errors.loadHistory'))
    }
  }

  const loadSession = async (sessionId, { silent = false } = {}) => {
    if (!silent) setSessionLoading(true)
    setError('')

    try {
      const session = await getAiTripSession(sessionId)
      applySession(session)
      setAuthRequired(false)
      return session
    } catch (err) {
      if (err?.status === 401) {
        setAuthRequired(true)
        setError(t('aiTrips.errors.authRequired'))
        return null
      }

      setError(err?.message || t('aiTrips.errors.loadSession'))
      return null
    } finally {
      if (!silent) setSessionLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const loadInitialData = async () => {
      setHistoryLoading(true)
      setHistoryError('')

      try {
        const payload = await listAiTripSessions()
        if (!isMounted) return

        const items = Array.isArray(payload?.items) ? payload.items : []
        setSessions(items)
        setAuthRequired(false)
        setMode('assistant')
        resetWorkspace('assistant')
      } catch (err) {
        if (!isMounted) return

        if (err?.status === 401) {
          setAuthRequired(true)
          setSessions([])
        } else {
          setHistoryError(err?.message || t('aiTrips.errors.loadHistory'))
        }
      } finally {
        if (isMounted) setHistoryLoading(false)
      }
    }

    loadInitialData()

    return () => {
      isMounted = false
    }
  }, [t])

  const handleModeChange = async (nextMode) => {
    if (nextMode === mode) return

    setMode(nextMode)
    resetWorkspace(nextMode)
  }

  const onGenerate = async () => {
    setError('')
    setLoading(true)

    try {
      const session = await generatePlan(form, { language })
      applySession(session)
      setMode('planner')
      setAuthRequired(false)
      await refreshHistory()
    } catch (err) {
      setError(
        err?.status === 401
          ? t('aiTrips.errors.authRequired')
          : err?.message || t('aiTrips.errors.generate'),
      )
    } finally {
      setLoading(false)
    }
  }

  const onExample = () => {
    setMode('planner')
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

  const visibleSessions = sessions.filter((item) => item.mode === mode)

  return (
    <div className="home aiTripsPage" dir={dir}>
      <Header />

      <main className="aiTripsMain">
        <AiTripsHero />

        <section className="aiTripsGrid">
          <div className="aiTripsSidebar">
            <AiTripsTabs mode={mode} setMode={handleModeChange} />

            {mode === 'planner' ? (
              <>
                <AiTripForm
                  form={form}
                  setForm={setForm}
                  onGenerate={onGenerate}
                  onExample={onExample}
                  loading={loading}
                />
                <AiTripHistory
                  mode="planner"
                  sessions={visibleSessions}
                  loading={historyLoading}
                  error={historyError}
                  authRequired={authRequired}
                  selectedId={currentSessionId}
                  onSelect={(sessionId) => loadSession(sessionId)}
                  title={t('aiTrips.plannerHistory.title')}
                  subtitle={t('aiTrips.plannerHistory.subtitle')}
                  emptyLabel={t('aiTrips.plannerHistory.empty')}
                />
              </>
            ) : (
              <>
                <AiAssistantGuide />
                <AiTripHistory
                  mode="assistant"
                  sessions={visibleSessions}
                  loading={historyLoading}
                  error={historyError}
                  authRequired={authRequired}
                  selectedId={currentSessionId}
                  onSelect={(sessionId) => loadSession(sessionId)}
                  title={t('aiTrips.assistantHistory.title')}
                  subtitle={t('aiTrips.assistantHistory.subtitle')}
                  emptyLabel={t('aiTrips.assistantHistory.empty')}
                />
              </>
            )}
          </div>

          <div className="aiTripsPanel">
            {mode === 'planner' ? (
              <AiTripResult
                plan={plan}
                loading={loading || sessionLoading}
                error={error}
                onRegenerate={onGenerate}
              />
            ) : (
              <AiChatPanel
                sessionId={currentSessionId}
                messages={messages}
                setMessages={setMessages}
                onSessionChanged={refreshHistory}
                onSessionLoaded={(session) => {
                  applySession(session)
                }}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AiTrips
