import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'
import LoadingDots from './components/LoadingDots'
import logo from '../../assets/images/landing-logo.png'

function LandingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home')
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="page">
      <main className="splash">
        <img className="logo" src={logo} alt="Logo" />
        <LoadingDots />
      </main>
    </div>
  )
}

export default LandingPage
