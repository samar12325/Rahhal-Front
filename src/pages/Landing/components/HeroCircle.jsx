import './HeroCircle.css'
import logo from '../../../assets/images/rahhal-logo.png'

function HeroCircle() {
  return (
    <section className="hero-circle" aria-hidden="true">
      <img src={logo} alt="شعار رحّال" className="visual-logo__img" />
    </section>
  )
}

export default HeroCircle
