import { Link } from 'react-router-dom'
import alula from '../../../assets/images/alula.jpg'
import riyadh from '../../../assets/images/riyadh.jpg'
import jeddah from '../../../assets/images/jeddah.jpg'
import planePath from '../../../assets/images/h-teal.png'
import { useLanguage } from '../../../i18n/LanguageContext'

function Hero() {
  const { t } = useLanguage()

  return (
    <section className="hero" id="home-top">
      <div className="container heroWrap heroWrapCenter">
        <div className="heroCenter heroCenterRel">
          <h1 className="heroTitle heroTitleCenter">
            {t('home.hero.titlePrefix')} <span className="accent">{t('home.hero.titleAccent')}</span>{' '}
            {t('home.hero.titleSuffix')}
          </h1>

          <p className="heroText heroTextCenter">
            {t('home.hero.description')}
          </p>

          <div className="heroCtas heroCtasCenter">
            <Link className="primaryBtn big" to="/ai-trips">
              {t('home.hero.ctaPlan')}
            </Link>
            <a className="secondaryBtn big" href="#destinations">
              {t('home.hero.ctaExplore')}
            </a>
          </div>

          <img className="planePathImg" src={planePath} alt="" aria-hidden="true" />
        </div>

        <div className="heroRight heroRightFix">
          <div className="collage collageRefFix">
            <div className="card big bigFix">
              <img src={alula} alt={t('destinationNames.alula')} />
            </div>

            <div className="stack stackFix">
              <div className="card small smallFix">
                <img src={riyadh} alt={t('destinationNames.riyadh')} />
              </div>
              <div className="card small smallFix">
                <img src={jeddah} alt={t('destinationNames.jeddah')} />
              </div>
            </div>

            <div className="planeDot planeDotFix" aria-hidden="true">
              ✈
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
