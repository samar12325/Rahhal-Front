import { useLanguage } from '../../i18n/LanguageContext'

function ChatMessage({ role, text }) {
  const { t, language } = useLanguage()
  const isUser = role === 'user'

  return (
    <div className={`chatMessage ${isUser ? 'user' : 'assistant'}`}>
      {!isUser ? <div className="chatAvatar assistant">AI</div> : null}

      <div className="chatMessageContent">
        <div className="chatMetaLabel">
          {isUser ? t('aiTrips.assistant.roleUser') : t('aiTrips.assistant.roleAssistant')}
        </div>
        <div className={`chatBubble ${isUser ? 'user' : 'assistant'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {text}
        </div>
      </div>

      {isUser ? <div className="chatAvatar user">{language === 'ar' ? 'أ' : 'U'}</div> : null}
    </div>
  )
}

export default ChatMessage
