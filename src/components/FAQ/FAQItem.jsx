import { useState } from 'react'
import './FAQItem.css'

function FAQItem({ question, answer, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`faqItem ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="faqQuestion"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{question}</span>
        <span className="faqIcon" aria-hidden="true">
          {isOpen ? '-' : '+'}
        </span>
      </button>
      <div className="faqAnswer" role="region" aria-hidden={!isOpen}>
        <p>{answer}</p>
      </div>
    </div>
  )
}

export default FAQItem
