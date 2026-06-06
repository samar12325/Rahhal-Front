function InfoCards({ items }) {
  if (!items?.length) {
    return null
  }

  return (
    <div className="infoCards">
      {items.map((item) => (
        <article className="infoCard" key={item.label}>
          <p className="infoLabel">{item.label}</p>
          <p className="infoValue">{item.value}</p>
        </article>
      ))}
    </div>
  )
}

export default InfoCards
