import { useEffect, useRef, useState } from 'react'
import ChatMessage from './ChatMessage'
import QuickPrompts from './QuickPrompts'
import { chatAndPatchPlan } from '../../services/aiChat'
import { startAssistantSession } from '../../services/aiTrips'
import { useLanguage } from '../../i18n/LanguageContext'

function AiChatPanel({ sessionId, messages, setMessages, onSessionChanged, onSessionLoaded }) {
  const { t, language } = useLanguage()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  const promptKeys = ['compare', 'family', 'weekend', 'coolWeather', 'sea', 'photography']
  const prompts = promptKeys.map((key) => t(`aiTrips.assistant.prompts.${key}`))

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const message = (text ?? input).trim()
    if (!message) return

    setInput('')
    setLoading(true)

    setMessages((prev) => [...prev, { role: 'user', text: message }])

    try {
      if (!sessionId) {
        const session = await startAssistantSession(message, { language })
        onSessionLoaded?.(session)
        onSessionChanged?.()
        return
      }

      const { reply } = await chatAndPatchPlan({
        sessionId,
        message,
        language,
      })

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }])
      onSessionChanged?.()
    } catch (err) {
      const fallbackText =
        err?.status === 401
          ? t('aiTrips.errors.authRequired')
          : err?.message || t('aiTrips.chat.error')

      if (!sessionId) {
        setMessages((prev) => [...prev, { role: 'assistant', text: fallbackText }])
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', text: fallbackText }])
      }
    } finally {
      setLoading(false)
    }
  }

  const displayedMessages =
    messages.length > 0 ? messages : []

  return (
    <section className="aiCard aiCardPad chatPanel">
      <div className="chatHead">
        <div className="chatAssistantBlock">
          <div className="chatHeroAvatar">AI</div>
          <div>
            <h2 className="aiFormTitle">{t('aiTrips.assistant.title')}</h2>
            <p className="chatHeadText">{t('aiTrips.assistant.subtitle')}</p>
          </div>
        </div>
        <div className="chatStatus">
          <span className="chatStatusDot" />
          {t('aiTrips.assistant.status')}
        </div>
      </div>

      <div className="chatPromptRail">
        <div className="chatPromptLabel">{t('aiTrips.assistant.quickTitle')}</div>
        <QuickPrompts prompts={prompts} onPick={(prompt) => send(prompt)} />
      </div>

      <div className="chatLog">
        {displayedMessages.length === 0 ? (
          <div className="chatWelcomeCard">
            <div className="chatWelcomeBadge">{t('aiTrips.assistant.tag')}</div>
            <h3 className="chatWelcomeTitle">{t('aiTrips.assistant.welcomeTitle')}</h3>
            <p className="chatWelcomeText">{t('aiTrips.assistant.intro')}</p>
            <div className="chatWelcomeGrid">
              <div className="chatWelcomeItem">
                {t('aiTrips.assistant.welcomeItems.compare')}
              </div>
              <div className="chatWelcomeItem">
                {t('aiTrips.assistant.welcomeItems.recommend')}
              </div>
              <div className="chatWelcomeItem">
                {t('aiTrips.assistant.welcomeItems.plan')}
              </div>
            </div>
          </div>
        ) : null}

        {displayedMessages.map((messageItem, index) => (
          <ChatMessage key={index} role={messageItem.role} text={messageItem.text} />
        ))}
        {loading ? (
          <div className="chatTyping">
            <div className="chatAvatar assistant">AI</div>
            <div className="chatTypingBubble">
              <div className="chatMetaLabel">{t('aiTrips.assistant.roleAssistant')}</div>
              <div className="typingDots" aria-label={t('aiTrips.chat.loading')}>
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      <div className="chatComposer">
        <div className="chatInputShell">
          <input
            className="chatComposerInput"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t('aiTrips.assistant.placeholder')}
            onKeyDown={(event) => {
              if (event.key === 'Enter') send()
            }}
          />
        </div>
        <button className="chatSendButton" type="button" onClick={() => send()} disabled={loading}>
          {t('aiTrips.chat.send')}
        </button>
      </div>
    </section>
  )
}

export default AiChatPanel
