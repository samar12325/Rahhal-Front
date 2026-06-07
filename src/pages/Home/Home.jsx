import './Home.css'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from './components/Hero'
import Destinations from './components/Destinations'
import Testimonials from './components/Testimonials'
import { useLanguage } from '../../i18n/LanguageContext'

function Home() {
  const { dir } = useLanguage()
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return

    const element = document.getElementById(location.hash.slice(1))
    if (!element) return

    const scrollToSection = () => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    window.requestAnimationFrame(scrollToSection)
  }, [location.hash])

  return (
    <div className="home" dir={dir}>
      <main>
        <Hero />
        <Destinations />
        <Testimonials />
      </main>
    </div>
  )
}

export default Home
