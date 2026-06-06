function Gallery({ images = [], name }) {
  if (!images.length) {
    return null
  }

  return (
    <div className="galleryGrid">
      {images.map((image, index) => (
        <div className="galleryItem" key={`${name}-${index}`}>
          <img src={image} alt={`${name} ${index + 1}`} loading="lazy" />
        </div>
      ))}
    </div>
  )
}

export default Gallery
