const groupTripTranslations = {
  en: {
    titles: {
      حزم: 'Hazm',
      'العلا التراثية 3 أيام': 'Heritage AlUla - 3 days',
      'رحلة جدة البحرية': 'Jeddah seaside trip',
      تجربه: 'Experience',
      'الدمام والاستجمام': 'Dammam relaxation escape',
      'تبوك المغامرة الشتوية': 'Tabuk winter adventure',
    },
    cities: {
      الرياض: 'Riyadh',
      جدة: 'Jeddah',
      العلا: 'AlUla',
      الدمام: 'Dammam',
      تبوك: 'Tabuk',
      مكة: 'Makkah',
    },
    destinations: {
      الرياض: 'Riyadh',
      جدة: 'Jeddah',
      العلا: 'AlUla',
      الدمام: 'Dammam',
      تبوك: 'Tabuk',
      مكة: 'Makkah',
    },
    descriptions: {
      غفقثص: 'Short group trip description.',
      'مواقع أثرية + جولات تصوير + فعاليات': 'Heritage sites, photo tours, and events.',
      'أنشطة بحرية وكورنيش وتجربة بحرية': 'Seaside activities, corniche visits, and a coastal experience.',
      'تجربة فقط': 'Simple experience only.',
      'واجهة بحرية + كافيهات + وقت راحة': 'Waterfront views, cafes, and time to unwind.',
      'رحلة شتوية وتجارب خارجية': 'A winter trip with outdoor experiences.',
    },
  },
}

export const localizeGroupTripValue = (language, field, value) => {
  if (!value || language === 'ar') return value
  return groupTripTranslations[language]?.[field]?.[value] ?? value
}
