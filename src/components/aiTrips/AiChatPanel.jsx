import { useEffect, useRef, useState } from 'react'
import ChatMessage from './ChatMessage'
import QuickPrompts from './QuickPrompts'
import { chatAndPatchPlan } from '../../services/aiChat'
import { useLanguage } from '../../i18n/LanguageContext'

function AiChatPanel({ plan, setPlan }) {
  const { t } = useLanguage()
  const [messages, setMessages] = useState(() => [
    { role: 'assistant', text: t('aiTrips.chat.intro') },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  const promptKeys = ['cheaper', 'nature', 'restaurants', 'easyDay', 'shopping', 'family']
  const prompts = promptKeys.map((key) => t(`aiTrips.prompts.${key}`))

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const message = (text ?? input).trim()
    if (!message) return

    if (!plan) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: t('aiTrips.chat.noPlan') },
      ])
      setInput('')
      return
    }

    setMessages((prev) => [...prev, { role: 'user', text: message }])
    setInput('')
    setLoading(true)

    try {
      const { reply, patchedPlan } = await chatAndPatchPlan({ message, plan, t })
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }])
      if (patchedPlan) setPlan(patchedPlan)
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: t('aiTrips.chat.error') },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="aiCard aiCardPad chatPanel">
      <div style={{ display: 'grid', gap: 10 }}>
        <div className="chatHead">
          <h2 className="aiFormTitle">{t('aiTrips.chat.title')}</h2>
          <span className="tag">{t('aiTrips.chat.tag')}</span>
        </div>

        <QuickPrompts prompts={prompts} onPick={(prompt) => send(prompt)} />
      </div>

      <div className="chatLog">
        {messages.map((messageItem, index) => (
          <ChatMessage key={index} role={messageItem.role} text={messageItem.text} />
        ))}
        {loading && <ChatMessage role="assistant" text={t('aiTrips.chat.loading')} />}
        <div ref={endRef} />
      </div>

      <div className="chatInputRow">
        <input
          className="input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t('aiTrips.chat.placeholder')}
          onKeyDown={(event) => {
            if (event.key === 'Enter') send()
          }}
        />
        <button className="primaryBtn" type="button" onClick={() => send()} disabled={loading}>
          {t('aiTrips.chat.send')}
        </button>
      </div>
    </section>
  )
}

export default AiChatPanel
