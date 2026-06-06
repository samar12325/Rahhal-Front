import { useMemo, useState } from 'react'
import PageHero from '../../components/Common/PageHero'
import FiltersBar from '../../components/Offers/FiltersBar'
import OfferCard from '../../components/Offers/OfferCard'
import offersData from '../../data/offers'
import './Offers.css'
import { useLanguage } from '../../i18n/LanguageContext'

const REGION_KEYS = ['all', 'central', 'west', 'east', 'north', 'south']
const TAG_KEYS = ['all', 'families', 'adventure', 'culture', 'sea', 'shopping']
const SORT_KEYS = ['mostDiscount', 'lowestPrice', 'highestRated']

const REGION_VALUE_MAP = {
  central: 'الوسطى',
  west: 'الغربية',
  east: 'الشرقية',
  north: 'الشمالية',
  south: 'الجنوبية',
}

const TAG_VALUE_MAP = {
  families: 'عائلات',
  adventure: 'مغامرة',
  culture: 'ثقافة',
  sea: 'بحر',
  shopping: 'تسوق',
}

function Offers() {
  const { t, dir } = useLanguage()
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('all')
  const [tag, setTag] = useState('all')
  const [sort, setSort] = useState('mostDiscount')

  const filteredOffers = useMemo(() => {
    let list = [...offersData]
    const q = query.trim()

    if (q) {
      const normalizedQuery = q.toLowerCase()
      list = list.filter((offer) =>
        `${offer.title} ${offer.destination} ${t(`offers.data.${offer.id}.title`, {
          fallback: offer.title,
        })} ${t(`offers.data.${offer.id}.destination`, {
          fallback: offer.destination,
        })}`
          .toLowerCase()
          .includes(normalizedQuery)
      )
    }

    if (region !== 'all') {
      const regionValue = REGION_VALUE_MAP[region] ?? region
      list = list.filter((offer) => offer.region === regionValue)
    }

    if (tag !== 'all') {
      const tagValue = TAG_VALUE_MAP[tag] ?? tag
      list = list.filter((offer) => offer.tags?.includes(tagValue))
    }

    if (sort === 'mostDiscount') {
      list.sort((a, b) => b.discountPercent - a.discountPercent)
    }

    if (sort === 'lowestPrice') {
      list.sort((a, b) => a.newPrice - b.newPrice)
    }

    if (sort === 'highestRated') {
      list.sort((a, b) => b.rating - a.rating)
    }

    return list
  }, [query, region, tag, sort, t])

  const regionOptions = REGION_KEYS.map((key) => ({
    key,
    label: t(`regions.${key}`, { fallback: REGION_VALUE_MAP[key] ?? key }),
  }))
  const tagOptions = TAG_KEYS.map((key) => ({
    key,
    label: t(`offers.tags.${key}`, { fallback: TAG_VALUE_MAP[key] ?? key }),
  }))
  const sortOptions = SORT_KEYS.map((key) => ({
    key,
    label: t(`offers.sorts.${key}`, { fallback: key }),
  }))

  return (
    <div className="offersPage" dir={dir}>
      <PageHero
        title={t('offers.hero.title')}
        subtitle={t('offers.hero.subtitle')}
      />

      <div className="container">
        <FiltersBar
          query={query}
          onQueryChange={setQuery}
          region={region}
          onRegionChange={setRegion}
          tag={tag}
          onTagChange={setTag}
          sort={sort}
          onSortChange={setSort}
          regions={regionOptions}
          tags={tagOptions}
          sorts={sortOptions}
          searchLabel={t('offers.filters.searchLabel')}
          searchPlaceholder={t('offers.filters.searchPlaceholder')}
          regionLabel={t('offers.filters.regionLabel')}
          sortLabel={t('offers.filters.sortLabel')}
        />

        {filteredOffers.length ? (
          <section className="offersGrid" aria-label={t('offers.listAria')}>
            {filteredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </section>
        ) : (
          <div className="offersEmpty">
            <h3>{t('offers.empty.title')}</h3>
            <p>{t('offers.empty.description')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Offers
