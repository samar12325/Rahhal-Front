import './PriceBadge.css'

import { useLanguage } from '../../i18n/LanguageContext'

function PriceBadge({ percent }) {
  const { t } = useLanguage()
  if (!percent) return null

  return (
    <span className="priceBadge">
      {t('offers.badge', { params: { percent } })}
    </span>
  )
}

export default PriceBadge
