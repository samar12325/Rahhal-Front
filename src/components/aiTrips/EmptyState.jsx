import { useLanguage } from '../../i18n/LanguageContext'

function EmptyState() {
  const { t } = useLanguage()
  return (
    <div className="aiResultEmpty">
      {t('aiTrips.empty.before')} <strong>{t('aiTrips.form.generate')}</strong>{' '}
      {t('aiTrips.empty.after')}
    </div>
  )
}

export default EmptyState
