import { useState, useEffect } from 'react'
import { useLanguage } from '../../../i18n/LanguageContext'
import { apiRequest } from '../../../api/client'

const renderStars = (rating) =>
  Array.from({ length: 5 }, (_, index) => (
    <span key={`testimonial-star-${index}`} className={`testimonial-star ${index < rating ? 'isFilled' : ''}`}>
      ★
    </span>
  ))

function Testimonials() {
  const { t } = useLanguage()
  const [reviews, setReviews] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    let isMounted = true
    const loadReviews = async () => {
      try {
        const payload = await apiRequest('/reviews?limit=6')
        if (!isMounted) return
        setReviews(Array.isArray(payload?.items) ? payload.items : [])
        setCurrentIndex(0)
      } catch {
        if (!isMounted) return
        setReviews([])
        setCurrentIndex(0)
      }
    }

    loadReviews()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (reviews.length <= 1) return undefined

    let timeoutId
    const intervalId = setInterval(() => {
      setFade(false)
      timeoutId = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length)
        setFade(true)
      }, 220)
    }, 3000)

    return () => {
      clearInterval(intervalId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [reviews.length])

  const current = reviews[currentIndex] ?? reviews[0]
  const hasReviews = reviews.length > 0

  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">{t('home.testimonials.title')}</h2>
          <p className="section-subtitle">{t('home.testimonials.subtitle')}</p>
        </div>

        <div className="testimonial-wrapper">
          <div className="testimonial-visual">
            <div className="testimonial-plane">✈︎</div>
            <div className="testimonial-line"></div>
          </div>
          {hasReviews ? (
            <div className={`testimonial-content ${fade ? 'fade-in' : 'fade-out'}`}>
              <div
                className="testimonial-stars"
                aria-label={t('home.testimonials.ratingLabel', {
                  params: { rating: current.rating },
                })}
              >
                {renderStars(current.rating)}
              </div>
              <p className="testimonial-text">“{current.comment}”</p>
              <span className="testimonial-context">{t('home.testimonials.guest')}</span>
            </div>
          ) : (
            <div className="testimonial-empty">
              <p>{t('home.testimonials.empty')}</p>
              <a className="primaryBtn" href="/profile#bookings">
                {t('home.testimonials.emptyCta')}
              </a>
            </div>
          )}
          <div className="testimonial-decoration">
            <div className="testimonial-dots">
              <span className="testimonial-dot"></span>
              <span className="testimonial-dot"></span>
              <span className="testimonial-dot"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
