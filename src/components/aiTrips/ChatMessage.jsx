function ChatMessage({ role, text }) {
  const isUser = role === 'user'
  return (
    <div className={`chatMessage ${isUser ? 'user' : 'assistant'}`}>
      <div className={`chatBubble ${isUser ? 'user' : 'assistant'}`}>{text}</div>
    </div>
  )
}

export default ChatMessage
