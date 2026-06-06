import './Home.css'
import Hero from './components/Hero'
import Destinations from './components/Destinations'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import { useLanguage } from '../../i18n/LanguageContext'

function Home() {
  const { dir } = useLanguage()

  return (
    <div className="home" dir={dir}>
      <main>
        <Hero />
        <Destinations />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

export default Home
