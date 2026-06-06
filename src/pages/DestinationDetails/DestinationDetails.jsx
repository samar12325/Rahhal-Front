import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import destinationsFallback from '../../data/destinations'
import ActivitiesList from '../../components/Destination/ActivitiesList'
import InfoCards from '../../components/Destination/InfoCards'
import MapEmbed from '../../components/Destination/MapEmbed'
import Gallery from '../../components/Destination/Gallery'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'
import './DestinationDetails.css'

const infoCards = [
  { label: 'أفضل وقت للزيارة', value: 'أكتوبر - مارس' },
  { label: 'نوع الرحلة', value: 'ثقافية وترفيهية' },
  { label: 'مدة مقترحة', value: '3 - 5 أيام' },
  { label: 'مستوى الميزانية', value: 'متوسطة' },
]

const REGION_LABELS = {
  central: 'الوسطى',
  west: 'الغربية',
  east: 'الشرقية',
  north: 'الشمالية',
  south: 'الجنوبية',
}

function DestinationDetails() {
  const { id } = useParams()
  const { t } = useLanguage()
  const [remoteDestination, setRemoteDestination] = useState(null)
  const [loadError, setLoadError] = useState('')

  const localDestination = useMemo(
    () => destinationsFallback.find((item) => item.id === id),
    [id],
  )
  const isNumericId = /^\d+$/.test(id ?? '')

  useEffect(() => {
    let isMounted = true

    const loadDestination = async () => {
      if (localDestination || !isNumericId) {
        setRemoteDestination(null)
        return
      }

      setLoadError('')
      try {
        const data = await apiRequest(`/destinations/${id}`)
        if (!isMounted) return
        const fallback = destinationsFallback.find((item) => item.name === data.name)
        setRemoteDestination({
          id: fallback?.id || data.id,
          name: data.name,
          region: data.region,
          description: data.description ?? '',
          coverImage: fallback?.coverImage || destinationsFallback[0]?.coverImage,
        })
      } catch (error) {
        if (!isMounted) return
        setLoadError(error?.message || 'تعذر تحميل الوجهة')
        setRemoteDestination(null)
      }
    }

    loadDestination()

    return () => {
      isMounted = false
    }
  }, [id, isNumericId, localDestination])

  const destination = localDestination || remoteDestination

  if (!destination) {
    return (
      <div className="destinationDetails" dir="rtl">
        <div className="container destinationEmpty">
          <h1 className="destinationEmptyTitle">الوجهة غير موجودة</h1>
          <p className="destinationEmptyText">
            {loadError || 'تأكد من الرابط أو استعرض وجهاتنا لاختيار تجربة جديدة.'}
          </p>
          <Link className="destinationBackBtn" to="/home">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    )
  }

  const regionLabel =
    t(`regions.${destination.region}`, {
      fallback: REGION_LABELS[destination.region] || destination.region,
    }) || destination.region

  const hasHighlights = Array.isArray(destination.highlights) && destination.highlights.length
  const hasActivities = Array.isArray(destination.activities) && destination.activities.length
  const hasGallery = Array.isArray(destination.gallery) && destination.gallery.length
  const hasMap = Boolean(destination.googleMapUrl)

  return (
    <div className="destinationDetails" dir="rtl">
      <section className="destinationHero">
        <div className="destinationHeroMedia">
          <img src={destination.coverImage} alt={destination.name} loading="lazy" />
          <div className="destinationHeroOverlay" />
        </div>
        <div className="container destinationHeroContent">
          <span className="destinationRegion">{regionLabel}</span>
          <h1 className="destinationName">{destination.name}</h1>
          <p className="destinationIntro">
            تجارب مختارة بعناية لتخطط رحلة لا تُنسى في قلب {destination.name}.
          </p>
          <a className="destinationCta" href="#activities">
            خطط رحلتك
          </a>
        </div>
      </section>

      <section className="destinationSection">
        <div className="container">
          <div className="sectionHeading">
            <h2>نبذة عن المكان</h2>
            <p className="sectionText">
              {destination.description || 'تعرف على أفضل ما يميز هذه الوجهة الفريدة.'}
            </p>
          </div>
          {localDestination ? <InfoCards items={infoCards} /> : null}
        </div>
      </section>

      {hasHighlights ? (
        <section className="destinationSection">
          <div className="container">
            <div className="sectionHeading">
              <h2>أبرز المعالم</h2>
              <p className="sectionText">مزيج من الثقافة والطبيعة والتجارب الأصيلة.</p>
            </div>
            <div className="highlightChips">
              {destination.highlights.map((item) => (
                <span className="highlightChip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hasActivities ? (
        <section className="destinationSection" id="activities">
          <div className="container">
            <div className="sectionHeading">
              <h2>فعاليات وتجارب في المكان</h2>
              <p className="sectionText">اختيارات تناسب العائلات والمغامرين ومحبي الهدوء.</p>
            </div>
            <ActivitiesList activities={destination.activities} destinationId={destination.id} />
          </div>
        </section>
      ) : null}

      {hasMap ? (
        <section className="destinationSection">
          <div className="container">
            <div className="sectionHeading">
              <h2>الخريطة</h2>
              <p className="sectionText">تعرف على موقع الوجهة وأقرب النقاط المهمة.</p>
            </div>
            <MapEmbed googleMapUrl={destination.googleMapUrl} name={destination.name} />
          </div>
        </section>
      ) : null}

      {hasGallery ? (
        <section className="destinationSection">
          <div className="container">
            <div className="sectionHeading">
              <h2>معرض الصور</h2>
              <p className="sectionText">لقطات تلخص جمال المكان وروح الرحلة.</p>
            </div>
            <Gallery images={destination.gallery} name={destination.name} />
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default DestinationDetails
