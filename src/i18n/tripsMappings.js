export const TRIP_TAG_KEYS = [
  'all',
  'today',
  'weekend',
  'family',
  'adventure',
  'culture',
  'sea',
  'nature',
]

export const TRIP_SORT_KEYS = ['highestRated', 'lowestPrice', 'nearest']

export const TRIP_TAG_VALUE_MAP = {
  today: 'اليوم',
  weekend: 'نهاية الأسبوع',
  family: 'عائلية',
  adventure: 'مغامرات',
  culture: 'ثقافية',
  sea: 'بحرية',
  nature: 'طبيعية',
}

export const TRIP_CITY_KEY_BY_AR = {
  'الرياض': 'riyadh',
  'جدة': 'jeddah',
  'العلا': 'alula',
  'أبها': 'abha',
  'الخبر': 'khobar',
  'الطائف': 'taif',
  'أملج': 'umluj',
}

export const TRIP_DURATION_KEY_BY_AR = {
  'يوم': 'day',
  'يومين': 'twoDays',
  'أسبوع': 'week',
}

export const TRIP_BADGE_KEY_BY_AR = {
  'يشمل مواصلات': 'transportation',
  'مرشد سياحي': 'tourGuide',
  'مناسب للعائلة': 'familyFriendly',
  'أنشطة بحرية': 'seaActivities',
  'تجربة تصوير': 'photoExperience',
  'مسارات مشي': 'hikingTrails',
  'زيارة متاحف': 'museumVisit',
  'وجبة محلية': 'localMeal',
  'دليل محلي': 'localGuide',
  'نقطة تجمع مرنة': 'flexibleMeet',
  'فندق 4 نجوم': 'hotel4',
  'نقطة تصوير': 'photoSpot',
  'سناك خفيف': 'lightSnack',
  'غوص اختياري': 'optionalDiving',
  'سكن فاخر': 'luxuryStay',
}

const invertMap = (map) =>
  Object.entries(map).reduce((acc, [key, value]) => {
    acc[value] = key
    return acc
  }, {})

const TRIP_CITY_VALUE_MAP = invertMap(TRIP_CITY_KEY_BY_AR)
const TRIP_DURATION_VALUE_MAP = invertMap(TRIP_DURATION_KEY_BY_AR)

export const getTripCityKey = (city) => TRIP_CITY_KEY_BY_AR[city] || city

export const getTripCityValue = (key) => TRIP_CITY_VALUE_MAP[key] || key

export const getTripDurationKey = (duration) => TRIP_DURATION_KEY_BY_AR[duration] || duration

export const getTripDurationValue = (key) => TRIP_DURATION_VALUE_MAP[key] || key

export const getTripTagValue = (key) => TRIP_TAG_VALUE_MAP[key] || key

export const getTripBadgeKey = (badge) => TRIP_BADGE_KEY_BY_AR[badge] || badge
