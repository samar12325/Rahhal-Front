function FiltersBar({
  query,
  onQueryChange,
  region,
  onRegionChange,
  tag,
  onTagChange,
  sort,
  onSortChange,
  regions,
  tags,
  sorts,
  searchLabel,
  searchPlaceholder,
  regionLabel,
  sortLabel,
}) {
  const getOptionValue = (item) => (typeof item === 'string' ? item : item.key)
  const getOptionLabel = (item) => (typeof item === 'string' ? item : item.label)

  return (
    <section className="offersFilters">
      <div className="offersFiltersRow">
        <div className="filterGroup">
          <label htmlFor="offer-search">{searchLabel}</label>
          <input
            id="offer-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>

        <div className="filterGroup">
          <label htmlFor="offer-region">{regionLabel}</label>
          <select
            id="offer-region"
            value={region}
            onChange={(event) => onRegionChange(event.target.value)}
          >
            {regions.map((item) => (
              <option key={getOptionValue(item)} value={getOptionValue(item)}>
                {getOptionLabel(item)}
              </option>
            ))}
          </select>
        </div>

        <div className="filterGroup">
          <label htmlFor="offer-sort">{sortLabel}</label>
          <select
            id="offer-sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
          >
            {sorts.map((item) => (
              <option key={getOptionValue(item)} value={getOptionValue(item)}>
                {getOptionLabel(item)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="offersTags">
        {tags.map((item) => (
          <button
            type="button"
            key={getOptionValue(item)}
            className={`tagChip ${tag === getOptionValue(item) ? 'active' : ''}`}
            onClick={() => onTagChange(getOptionValue(item))}
          >
            {getOptionLabel(item)}
          </button>
        ))}
      </div>
    </section>
  )
}

export default FiltersBar
