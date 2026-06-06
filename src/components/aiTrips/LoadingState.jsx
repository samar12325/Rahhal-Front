import { useLanguage } from '../../i18n/LanguageContext'

function LoadingState() {
  const { t } = useLanguage()
  return <p className="aiResultLoading">{t('aiTrips.loading')}</p>
}

export default LoadingState
