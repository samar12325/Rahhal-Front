import './CTA.css'

function CTA() {
  const handleClick = () => {
    window.location.href = '/home'
  }

  return (
    <div className="cta-row">
      <button className="cta-btn" type="button" onClick={handleClick}>
        ابدأ رحلتك
      </button>
    </div>
  )
}

export default CTA
