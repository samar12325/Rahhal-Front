import { useLanguage } from '../../i18n/LanguageContext'

function GroupTripsSearch({ query, setQuery }) {
  const { t } = useLanguage()
  const handleSearch = (e) => {
    e.preventDefault()
    // Search is handled by filtering in parent component
  }

  return (
    <section className="groupTripsSearchBar">
      <form onSubmit={handleSearch} className="groupTripsSearchForm">
        <div className="groupTripsSearchWrapper">
          <svg
            className="groupTripsSearchIcon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            className="groupTripsSearchInput"
            placeholder={t('groupTrips.search.placeholder')}
            aria-label={t('groupTrips.search.ariaLabel')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="groupTripsSearchSubmitBtn"
            aria-label={t('groupTrips.search.submitLabel')}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
    </section>
  )
}

export default GroupTripsSearch
