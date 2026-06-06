const tripTypes = [
  { title: 'رحلات عائلية', description: 'برامج مريحة تناسب العائلة والأطفال.' },
  { title: 'مغامرات', description: 'هايكنج، مخيمات، وتجارب خارج المألوف.' },
  { title: 'ثقافية', description: 'متاحف، تراث، وتجارب أصيلة.' },
]

function Features() {
  return (
    <section className="features" id="trip-types">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">أنواع الرحلات</h2>
          <p className="section-subtitle">اختر النوع المناسب لك وابدأ التخطيط.</p>
        </div>

        <div className="feature-grid">
          {tripTypes.map((t) => (
            <article key={t.title} className="feature-card">
              <div className="feature-copy">
                <h3>{t.title}</h3>
                <p>{t.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
