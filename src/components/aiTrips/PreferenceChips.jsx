function PreferenceChips({ options, selected, onChange, multi = false }) {
  const normalizeOption = (option) => {
    if (typeof option === 'string') return { value: option, label: option }
    const value = option.value ?? option.key
    return { value, label: option.label ?? value }
  }

  const handleClick = (value) => {
    if (!multi) {
      onChange(value)
      return
    }

    const list = Array.isArray(selected) ? selected : []
    const has = list.includes(value)
    const next = has ? list.filter((item) => item !== value) : [...list, value]
    onChange(next)
  }

  return (
    <div className="chipRow">
      {options.map((option) => {
        const normalized = normalizeOption(option)
        const value = normalized.value
        const label = normalized.label
        const isActive = multi
          ? Array.isArray(selected) && selected.includes(value)
          : selected === value
        return (
          <button
            key={value}
            type="button"
            className={`tag ${isActive ? 'active' : ''}`}
            onClick={() => handleClick(value)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default PreferenceChips
