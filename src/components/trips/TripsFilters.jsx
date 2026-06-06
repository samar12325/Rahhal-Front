function TripsFilters({
  chips,
  sorts,
  cities,
  durations,
  query,
  setQuery,
  activeChip,
  setActiveChip,
  filters,
  setFilters,
  title,
  resetLabel,
  ariaLabel,
  searchLabel,
  searchPlaceholder,
  cityLabel,
  durationLabel,
  budgetLabel,
  minPlaceholder,
  maxPlaceholder,
  sortLabel,
}) {
  const getOptionValue = (item) => (typeof item === 'string' ? item : item.key)
  const getOptionLabel = (item) => (typeof item === 'string' ? item : item.label)

  const handleReset = () => {
    setQuery('')
    setActiveChip('all')
    setFilters({
      city: 'all',
      duration: 'all',
      sort: 'highestRated',
      minPrice: '',
      maxPrice: '',
    })
  }

  return (
    <section className="filtersCard" aria-label={ariaLabel}>
      <div className="filtersTop">
        <h2 className="filtersTitle">{title}</h2>
        <button type="button" className="filtersReset" onClick={handleReset}>
          {resetLabel}
        </button>
      </div>

      <div className="chipsRow" role="list">
        {chips.map((chip) => (
          <button
            key={getOptionValue(chip)}
            type="button"
            className={`chip ${activeChip === getOptionValue(chip) ? 'active' : ''}`}
            role="listitem"
            onClick={() => setActiveChip(getOptionValue(chip))}
          >
            {getOptionLabel(chip)}
          </button>
        ))}
      </div>

      <div className="filtersRow">
        <div className="field">
          <label htmlFor="trip-search">{searchLabel}</label>
          <input
            id="trip-search"
            type="search"
            className="input"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="trip-city">{cityLabel}</label>
          <select
            id="trip-city"
            className="select"
            value={filters.city}
            onChange={(event) => setFilters((prev) => ({ ...prev, city: event.target.value }))}
          >
            {cities.map((city) => (
              <option key={getOptionValue(city)} value={getOptionValue(city)}>
                {getOptionLabel(city)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="trip-duration">{durationLabel}</label>
          <select
            id="trip-duration"
            className="select"
            value={filters.duration}
            onChange={(event) => setFilters((prev) => ({ ...prev, duration: event.target.value }))}
          >
            {durations.map((duration) => (
              <option key={getOptionValue(duration)} value={getOptionValue(duration)}>
                {getOptionLabel(duration)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>{budgetLabel}</label>
          <div className="budgetRow">
            <input
              type="number"
              min="0"
              className="input"
              placeholder={minPlaceholder}
              value={filters.minPrice}
              onChange={(event) => setFilters((prev) => ({ ...prev, minPrice: event.target.value }))}
            />
            <input
              type="number"
              min="0"
              className="input"
              placeholder={maxPlaceholder}
              value={filters.maxPrice}
              onChange={(event) => setFilters((prev) => ({ ...prev, maxPrice: event.target.value }))}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="trip-sort">{sortLabel}</label>
          <select
            id="trip-sort"
            className="select"
            value={filters.sort}
            onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))}
          >
            {sorts.map((sort) => (
              <option key={getOptionValue(sort)} value={getOptionValue(sort)}>
                {getOptionLabel(sort)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}

export default TripsFilters
