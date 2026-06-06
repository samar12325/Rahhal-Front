import { useLanguage } from '../../i18n/LanguageContext'

function TripsPagination() {
  const { t } = useLanguage()

  return (
    <div className="tripsPagination">
      <button type="button" className="secondaryBtn big">
        {t('trips.actions.loadMore')}
      </button>
    </div>
  )
}

export default TripsPagination
