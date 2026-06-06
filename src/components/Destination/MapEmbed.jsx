function MapEmbed({ googleMapUrl, name }) {
  if (!googleMapUrl) {
    return <div className="mapPlaceholder">سيتم إضافة الخريطة قريباً</div>
  }

  return (
    <div className="mapEmbed">
      <iframe
        title={`خريطة ${name}`}
        src={googleMapUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  )
}

export default MapEmbed
